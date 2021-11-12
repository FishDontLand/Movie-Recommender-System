-- search movies based on the rating/revenue/releaseYear range
WITH movieGenres AS(
    SELECT m.movie_id as id, g.genres_name
    FROM movieGenresRelation as m LEFT JOIN genres g on m.genres_id = g.genres_id
),
movieCompany AS(
    SELECT mpc.movie_id as id2, pc.production_companies_name as Company
    FROM movieProductionCompanies AS mpc LEFT JOIN productionCompanies as pc
          ON mpc.production_companies_id=pc.production_companies_id
),
movieCountry AS(
    SELECT mpc2.movie_id as id3, pc2.production_countries_name as Country
    FROM movieProductionCountries AS mpc2 LEFT JOIN productionCountries AS pc2
          ON mpc2.production_country_abbr=pc2.production_country_abbr
)
SELECT DISTINCT m.original_title AS MovieName,
                mg.genres_name AS Genres,
                mc2.Country AS Country,
                sl.spoken_languages_name AS Language,
                year(m.release_date) AS ReleaseYear,
                m.release_date AS ReleaseDate,
                m.vote_average AS Rate
FROM meta AS m LEFT JOIN spokenLanguages AS sl ON m.original_language=sl.spoken_languages_abbr
               LEFT JOIN movieGenres AS mg ON m.id=mg.id
               LEFT JOIN movieCompany AS mc ON m.id=mc.id2
               LEFT JOIN movieCountry as mc2 ON m.id=mc2.id3
WHERE '1995'<year(m.release_date)<'2021'
      AND 1000000000<m.revenue<2000000000
      AND 6.3<m.vote_average<9.5
;
