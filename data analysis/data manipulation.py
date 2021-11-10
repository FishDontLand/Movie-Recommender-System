import numpy as np
import pandas as pd


def _convert_str_to_dataframe(string, movie_id, prefix):
    """
    Convert a string representation of an array of json objects into a data frame

    Args:
        string: string representation of an array of json objects
        movie_id: movie_id that is at the same row as the string
        prefix: prefix added to the column names. base column names are ['id', 'name']
    """
    if pd.notnull(string):
        lst = eval(string)
        # if the string representation is not a list
        # treat it as an empty list
        if type(lst) != list:
            lst = [{'id': np.nan, 'name': np.nan}]
    else:
        lst = [{'id': np.nan, 'name': np.nan}]
    frame = pd.DataFrame(lst)
    frame.columns = [prefix + c for c in frame.columns]
    frame['movie_id'] = movie_id
    return frame


def clean_meta_data(meta_data):
    genre_data_to_stack = []
    collections = []
    production_company_data_to_stack = []
    for idx, row in meta_data.iterrows():
        genre_str = row['genres']
        genre_frame = _convert_str_to_dataframe(genre_str, row['id'], prefix='genre_')
        genre_data_to_stack.append(genre_frame)

        production_company_str = row['production_companies']
        production_frame = _convert_str_to_dataframe(production_company_str, row['id'], prefix='production_company_')
        production_company_data_to_stack.append(production_frame)

        collections.append(eval(row['belongs_to_collection']) if pd.notnull(row['belongs_to_collection']) else {})

    concat_genre_data = pd.concat(genre_data_to_stack, axis=0)
    concat_genre_data['genre_id'] = concat_genre_data['genre_id'].astype('Int64')
    genre_data_summary = concat_genre_data.groupby(['genre_id', 'genre_name']).size().reset_index()[
        ['genre_id', 'genre_name']]
    movie_genre = concat_genre_data[['movie_id', 'genre_id']]

    concat_production_company_data = pd.concat(production_company_data_to_stack, axis=0)
    concat_production_company_data['production_company_id'] = concat_production_company_data[
        'production_company_id'].astype('Int64')
    production_company_data = concat_production_company_data.groupby(
        ['production_company_id', 'production_company_name']).size()
    production_company_data = production_company_data.reset_index()[
        ['production_company_id', 'production_company_name']]
    movie_production_company = concat_production_company_data[['movie_id', 'production_company_id']]

    collections = [e if type(e) == dict else {} for e in collections]
    collection_data = pd.DataFrame(collections)
    collection_data.columns = ['collection_' + name for name in collection_data.columns]

    clean_meta_data = pd.concat([meta_data, collection_data], axis=1).drop(
        columns=['genres', 'belongs_to_collection', 'production_companies'])

    return {'genre_data': genre_data_summary,
            'movie_genre': movie_genre,
            'production_company': production_company_data,
            'movie_production_company': movie_production_company,
            'clean_meta_data': clean_meta_data}


def main():
    meta_data = pd.read_csv("C:\\Users\\dongz\\OneDrive\\Dongzhou's Document\\Learning\\online study\\MCIT\\CIS550\\Movie-Recommender-System\\raw data\movies_metadata.csv")
    output_data_sets = clean_meta_data(meta_data)
    for key, value in output_data_sets.items():
        value.to_csv("C:\\Users\\dongz\\OneDrive\\Dongzhou's Document\\Learning\\online study\\MCIT\\CIS550\\Movie-Recommender-System\\clean data\\" + key + '.csv', index=False)


if __name__ == '__main__':
    main()