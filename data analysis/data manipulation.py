import numpy as np
import pandas as pd
import click
import os
from pandas.api.types import is_numeric_dtype

NAME_MAP = {'clean_meta_data': 'meta',
            'genres_data': 'genres',
            'movie_genres_relation': 'movieGenresRelation',
            'movie_production_companies_relation': 'movieProductionCompanies',
            'movie_production_countries_relation': 'movieProductionCountries',
            'movie_spoken_languages_relation': 'movieSpokenLanguages',
            'production_companies_data': 'productionCompanies',
            'production_countries_data': 'productionCountries',
            'spoken_languages_data': 'spokenLanguages'}


def _convert_str_to_dataframe(string, movie_id, prefix, id_name, value_name):
    """
    Convert a string representation of an array of json objects into a data frame

    Args:
        string: string representation of an array of json objects
        movie_id: movie_id that is at the same row as the string
        prefix: prefix added to the column names.
    Returns:
        a dataframe representation of the json array
    """
    if pd.notnull(string):
        lst = eval(string)
        # if the string representation is not a list
        # treat it as an empty list
        if type(lst) != list:
            lst = [{id_name: np.nan, value_name: np.nan}]
    else:
        lst = [{id_name: np.nan, value_name: np.nan}]
    frame = pd.DataFrame(lst)
    frame.columns = [prefix + c for c in frame.columns]
    frame['movie_id'] = movie_id
    return frame


def _reorganize_many_to_many_column(data, col_name, movie_id_col, prefix, id_name,  value_name):
    """
    helper function to create a entity data set and a relationship data set based on
    the column that contains array of json object

    Args:
        data: input data that contains the column of json arrary
        col_name: column that contains a json array
        movie_id_col: column that specifies the column id, and the id will be used in the relationship dataset
        prefix: prefix added to the column names of the entity data set and and the
                column names of the relationship data set(prefix will not be added to movie_id column)
        id_name: name of the id column in the json object
        value_name: name of the value column in the json object
    Returns:
        an entity data set and a relationship dataset
    """
    data_to_stack = []
    for idx, row in data.iterrows():
        json_array_str = row[col_name]
        frame = _convert_str_to_dataframe(json_array_str, row[movie_id_col], prefix, id_name, value_name)
        data_to_stack.append(frame)

    concat_data = pd.concat(data_to_stack, axis=0)
    if is_numeric_dtype(concat_data[prefix + id_name]):
        concat_data[prefix + id_name] = concat_data[prefix + id_name].astype('Int64')
    concat_data_summary = concat_data.groupby([prefix + id_name, prefix + value_name]).size().reset_index()
    concat_data_summary = concat_data_summary[[prefix + id_name, prefix + value_name]]
    relationship_data = concat_data[['movie_id', prefix + id_name]]
    return concat_data_summary, relationship_data


def _reorganize_many_to_one_column(data, col_name, prefix):
    """
    helper function to transform the each column of json objects into a data frame
    Args:
        data: data that contains the column of json object
        col_name: name of the column that stores the json objects
        prefix: prefix added to the column names of the output data
    Returns:
        a dataframe representation of the json column
    """
    lst_of_obs = []
    for idx, row in data.iterrows():
        lst_of_obs.append(eval(row[col_name]) if pd.notnull(row[col_name]) else {})
    lst_of_obs = [e if type(e) == dict else {} for e in lst_of_obs]
    data = pd.DataFrame(lst_of_obs)
    data.columns = [prefix + name for name in data.columns]
    return data


def reorganize_meta_data(meta_data):
    """
    Function that removes columns of json objects or columns of json arrays, and transform those columns into independent dataframes
    Args:
        meta_data: dataframe
    """
    output_dict = dict()
    # columns that store json arrays
    for col in ['genres', 'production_companies', 'production_countries', 'spoken_languages']:
        if col == 'genres' or col == 'production_companies':
            id_name = 'id'
        elif col == 'production_countries':
            id_name = 'iso_3166_1'
        else:
            id_name = 'iso_639_1'
        value_name = 'name'
        summary_data, relationship = _reorganize_many_to_many_column(meta_data, col, 'id',
                                                                     col + '_', id_name, value_name)
        output_dict[col + '_data'] = summary_data
        output_dict['movie_' + col + '_relation'] = relationship
    # deal with belongs_to_collection column, which stores json objects instead of json arrays
    data = _reorganize_many_to_one_column(meta_data, 'belongs_to_collection', 'collection_')
    # remove columns of json arrays and json objects
    clean_meta_data = pd.concat([meta_data, data], axis=1).drop(columns=['genres', 'production_companies', \
                                                                                   'production_countries', 'spoken_languages',\
                                                                                  'belongs_to_collection'] )
    output_dict['clean_meta_data'] = clean_meta_data
    return output_dict



@click.command()
@click.option('--raw_data_path', required=True)
@click.option('--output_path', required=True)
def main(raw_data_path, output_path):
    """
    main function that takes the original raw movie data set, and then conducts data cleaning,
    and stores the clean data into the output_path
    Args:
        raw_data_path: path string to the raw movie data set
        output_path: path string to store the clean data
    """
    raw_data_path = r'{}'.format(raw_data_path)
    all_raw_data_files = os.listdir(raw_data_path)
    data_names = [name.split('.')[0] for name in all_raw_data_files]
    clean_data_dict = dict()
    for i in range(len(all_raw_data_files)):
        read_file = r'{}\{}'.format(raw_data_path, all_raw_data_files[i])
        raw_data = pd.read_csv(read_file)
        if data_names[i] == 'movies_metadata':
            raw_data = raw_data.groupby('id').first().reset_index()
            output_data_sets = reorganize_meta_data(raw_data)
            for key, value in output_data_sets.items():
                clean_data_dict[key] = value
        elif data_names[i] == 'keyword':
            output_data_sets = _reorganize_many_to_many_column(raw_data, 'keywords', 'id',
                                                               'keyword_', 'id', 'name')
            for key, value in output_data_sets.items():
                clean_data_dict[key] = value
        else:
            clean_data_dict[data_names[i]] = raw_data
    for key, value in output_data_sets.items():
        save_file = r'{}\{}'.format(output_path, NAME_MAP[key] + '.csv')
        value.to_csv(save_file, index=False)

if __name__ == '__main__':
    main()