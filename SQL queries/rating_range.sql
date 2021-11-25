use test;


select distinct mi.movie_id,
       m.title,
       m.release_date,
       m.vote_average,
       m.imdb_id,
       m.overview,
       m.runtime,
       m.status,
       il.links as poster_link,
       pc.production_companies_name as production_companies
from (select * from meta order by vote_average desc) m left join movieInfo mi on m.id = mi.movie_id
                                                       left join imageLink il on m.imdb_id=il.IMDBid
                                                       left join productionCompanies pc on mi.production_companies_id=pc.production_companies_id
WHERE m.vote_average between 6.5 and 9.6
limit 10
;
