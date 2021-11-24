use test;


select a.name, m.title, g.genres_name, m.vote_average
from (
    select c.name, mc.movie_id
    from cast c left join movieCast mc on c.cast_id=mc.cast_id
    where c.name='James Russo') a inner join movieMeta m on m.id=a.movie_id
                                  inner join movieInfo mi on m.id=mi.movie_id
                                  inner join genres g on mi.genres_id=g.genres_id
group by g.genres_name, a.movie_id, m.id, m.title, a.name, m.vote_average
order by m.vote_average desc
limit 3;