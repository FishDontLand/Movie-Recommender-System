USE test;


SELECT A.*, B.links AS poster_link
FROM
(SELECT id AS movie_id, title, release_date, vote_average, imdb_id, overview, runtime,
       status
FROM meta
WHERE id = 96451) A
LEFT JOIN imageLink B
ON A.imdb_id = B.IMDBid;
