USE test;

WITH movie_info AS (
SELECT C.movie_id, D.title, D.release_date, D.vote_average, D.imdb_id, D.runtime,
       D.overview, D.status, K.links AS poster_link
FROM
(SELECT DISTINCT movie_id
FROM
(SELECT DISTINCT genres_id
FROM genres
WHERE genres_name = 'Adventure') A LEFT JOIN movieGenresRelation B
ON A.genres_id = B.genres_id) C LEFT JOIN meta D
ON C.movie_id = D.id
LEFT JOIN imageLink K
ON D.imdb_id = K.IMDBid
)
SELECT movie_info.*, production_companies
FROM movie_info
LEFT JOIN
(SELECT J.movie_id, GROUP_CONCAT(J.company_name) AS production_companies
FROM
(SELECT G.movie_id, H.production_companies_id AS company_id, I.production_companies_name AS company_name
FROM movie_info G
LEFT JOIN
movieProductionCompanies H
ON G.movie_id = H.movie_id
LEFT JOIN productionCompanies I
ON H.production_companies_id = I.production_companies_id) J
GROUP BY J.movie_id) L
ON movie_info.movie_id = L.movie_id;