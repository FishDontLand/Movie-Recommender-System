-- After searching, Rate sorting
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
SELECT DISTINCT m.id as id,
                m.original_title AS MovieName,
                mg.genres_name AS Genres,
                mc2.Country AS Country,
                sl.spoken_languages_name AS Language,
                year(m.release_date) AS ReleaseYear,
                m.release_date AS ReleaseDate,
                m.vote_average AS Rate,
                m.revenue AS Revenue,
                m.budget AS Budget,
                m.revenue-m.budget AS Profit
FROM meta AS m LEFT JOIN spokenLanguages AS sl ON m.original_language=sl.spoken_languages_abbr
               LEFT JOIN movieGenres AS mg ON m.id=mg.id
               LEFT JOIN movieCompany AS mc ON m.id=mc.id2
               LEFT JOIN movieCountry as mc2 ON m.id=mc2.id3
WHERE mc2.Country='United States of America'
      AND mg.genres_name='Adventure'
      AND year(m.release_date)='1995'
ORDER BY m.vote_average DESC
LIMIT 10
;