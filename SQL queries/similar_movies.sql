USE test;

WITH movie_info AS (SELECT A.movie_id, B.title, B.release_date, B.vote_average, B.imdb_id
FROM
(SELECT DISTINCT movie_id
FROM movieKeywords
WHERE movie_id IN (SELECT DISTINCT movie_id
                    FROM (SELECT movie_id, SUM(related) AS relation
                            FROM
                            (SELECT movie_id, (genres_id IN (SELECT genres_id
                                                                    FROM movieGenresRelation
                                                                    WHERE movie_id = 2)) AS related
                            FROM (SELECT movie_id, genres_id
                                    FROM
                                    movieGenresRelation
                                    WHERE movie_id IN (SELECT DISTINCT movie_id
                                                        FROM movieGenresRelation
                                                        WHERE genres_id IN (SELECT genres_id
                                                                            FROM movieGenresRelation
                                                                            WHERE movie_id = 2))) M) N
                            GROUP BY movie_id
                            ORDER BY SUM(related) DESC) P
                    ) LIMIT 50) A LEFT JOIN meta B
ON A.movie_id = B.id)
SELECT movie_info.*, F.links AS poster_link
FROM
movie_info LEFT JOIN imageLink F
ON movie_info.imdb_id = F.IMDBid
ORDER BY vote_average DESC;