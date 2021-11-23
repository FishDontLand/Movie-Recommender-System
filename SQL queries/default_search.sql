USE test;


SELECT A.id AS movie_id, A.title, A.release_date, A.vote_average, A.imdb_id, A.overview, A.runtime,
       A.status, B.links AS poster_link
FROM meta A LEFT JOIN imageLink B
ON A.imdb_id = B.IMDBid
ORDER BY vote_average DESC
LIMIT 100;
