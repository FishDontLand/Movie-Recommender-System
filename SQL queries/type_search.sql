USE test;

WITH movie_info AS (
SELECT C.movie_id, D.title, D.release_date, D.vote_average, D.imdb_id
FROM
(SELECT DISTINCT movie_id
FROM
(SELECT DISTINCT genres_id
FROM genres
WHERE genres_name = 'Adventure') A LEFT JOIN movieGenresRelation B
ON A.genres_id = B.genres_id) C LEFT JOIN meta D
ON C.movie_id = D.id
ORDER BY vote_average DESC
LIMIT 50
)
SELECT E.*, F.links AS poster_link
FROM
(SELECT movie_info.*, score AS rating
FROM movie_info
         LEFT JOIN(SELECT movieId, (mean - 1.96 * std) AS score
                   FROM (SELECT movieId, AVG(rating) AS mean, STD(rating) AS std
                         FROM ratings
                         WHERE movieId IN (SELECT movie_id AS movidId FROM movie_info)
                         GROUP BY movieId) C) D
                  ON movie_info.movie_id = D.movieId) E LEFT JOIN imageLink F
ON E.imdb_id = F.IMDBid
ORDER BY rating DESC, vote_average DESC;