-- movie map
-- country
WITH movieCountry AS(
    SELECT mpc2.movie_id as id1, pc2.production_countries_name as Country
    FROM movieProductionCountries AS mpc2 LEFT JOIN productionCountries AS pc2
          ON mpc2.production_country_abbr=pc2.production_country_abbr
)
SELECT mc.Country, count(*) as NumOfMovies
FROM meta AS m LEFT JOIN movieCountry AS mc ON m.id=mc.id1
WHERE mc.Country IS NOT NULL
GROUP BY mc.Country
ORDER BY COUNT(*) DESC
;

-- movie map
-- country, genres
WITH movieCountry AS(
    SELECT mpc2.movie_id as id1, pc2.production_countries_name as Country
    FROM movieProductionCountries AS mpc2 LEFT JOIN productionCountries AS pc2
          ON mpc2.production_country_abbr=pc2.production_country_abbr
),
movieGenres AS(
    SELECT m.movie_id as id2, g.genres_name
    FROM movieGenresRelation as m LEFT JOIN genres g on m.genres_id = g.genres_id
)
SELECT mc.Country, mg.genres_name AS Genres, count(*) AS NumOfMovies
FROM meta AS m LEFT JOIN movieCountry AS mc ON m.id=mc.id1
               LEFT JOIN movieGenres AS mg ON m.id=mg.id2
WHERE mc.Country IS NOT NULL
        AND mg.genres_name IS NOT NULL
GROUP BY mc.Country, mg.genres_name
ORDER BY mc.Country, COUNT(*) DESC
;