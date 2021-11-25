const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');
const {query} = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//                  Keyword search 
// ********************************************
async function search_keyword(req, res) {
    if (req.query.keyword) {
        connection.query(`WITH movie_info AS (SELECT A.movie_id, B.title, B.release_date, B.vote_average, B.imdb_id,
            B.overview, B.runtime, B.status
            FROM
            (SELECT DISTINCT movie_id
            FROM movieKeywords
            WHERE movie_id IN (SELECT DISTINCT keyword_id
            FROM keywords
            WHERE UPPER(keyword_name) LIKE UPPER('%${req.query.keyword}%'))) A LEFT JOIN meta B
            ON A.movie_id = B.id)
            SELECT E.*, F.links AS poster_link
            FROM
            (SELECT movie_info.*, score AS rating
            FROM movie_info
            LEFT JOIN(SELECT movieId, (mean - 1.96 * std) AS score
                FROM (SELECT movie_id AS movieId, AVG(rating) as mean, STD(rating) as std
                    FROM
                    (SELECT movie_id, rating
                    FROM movie_info LEFT JOIN ratings
                    ON movie_id = movieId) G
                    GROUP BY movie_id
                        ) AS C) D
            ON movie_info.movie_id = D.movieId) E LEFT JOIN imageLink F
            ON E.imdb_id = F.IMDBid
            ORDER BY rating DESC, vote_average DESC;`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({error: error})
            } else if (results) {
                res.json({results: results})
            }
        })
    } else {
        connection.query(`SELECT A.id AS movie_id, A.title, A.release_date, A.vote_average, A.imdb_id, A.overview, A.runtime,
            A.status, B.links AS poster_link
            FROM meta A LEFT JOIN imageLink B
            ON A.imdb_id = B.IMDBid
            ORDER BY vote_average DESC
            LIMIT 100;`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({error: error})
            } else if (results) {
                res.json({results: results})
            }
        })
    }
}

// ********************************************
//                  Type Search 
// ********************************************
async function search_type(req, res) {
    if (req.query.type) {
        connection.query(`WITH movie_info AS (
            SELECT C.movie_id, D.title, D.release_date, D.vote_average, D.imdb_id, D.runtime,
                   D.overview, D.status, K.links AS poster_link
            FROM
            (SELECT DISTINCT movie_id
            FROM
            (SELECT DISTINCT genres_id
            FROM genres
            WHERE genres_name = '${req.query.type}') A LEFT JOIN movieGenresRelation B
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
            ON movie_info.movie_id = L.movie_id;`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({error: error})
            } else if (results) {
                res.json({results: results})
            }
        })
    } else {
        res.json({error: 'movie type missing'})
    }
}

// ********************************************
//                  Similar Movies 
// ********************************************
async function search_similar(req, res) {
    if (req.query.movie_id && !isNaN(req.query.movie_id)) {
        connection.query(`WITH movie_info AS (SELECT A.movie_id, B.title, B.release_date, B.vote_average, B.imdb_id
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
                                                                                        WHERE movie_id = ${req.query.movie_id}))) M) N
                                        GROUP BY movie_id
                                        ORDER BY SUM(related) DESC) P
                                ) LIMIT 50) A LEFT JOIN meta B
            ON A.movie_id = B.id)
            SELECT movie_info.*, F.links AS poster_link
            FROM
            movie_info LEFT JOIN imageLink F
            ON movie_info.imdb_id = F.IMDBid
            ORDER BY vote_average DESC;`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({error: error})
            } else if (results) {
                res.json({results: results})
            }
        })
    } else {
        res.json({error: 'movie_id missing or movie_id is not a number'})
    }
}


async function search_id(req, res) {
    if (req.query.id && !isNaN(req.query.id)) {
        connection.query(`SELECT A.*, B.links AS poster_link
        FROM
        (SELECT id AS movie_id, title, release_date, vote_average, imdb_id, overview, runtime,
               status
        FROM meta
        WHERE id = ${req.query.id}) A
        LEFT JOIN imageLink B
        ON A.imdb_id = B.IMDBid;`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({error: error})
            } else if (results) {
                res.json({results: results})
            }
        })
    } else {
        res.json({error: 'movie type missing'})
    }
}

let users = require('./user').items;
let findUser = function (name, password) {
    return users.find(function (item) {
        return item.name === name && item.password === password;
    });
};

async function login(req, res) {
    if (req.body.username && req.body.password) {
        connection.query(` Select user_id From users
            WHERE user_name = '${req.body.username}' AND
            user_pass = '${req.body.password}';`,
            function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({error : error})
            } else if (results) {
                // let sessionId = results[0].user_id
                    let user = {
                    'displayName': req.body.username,
                    'sessionId': '12345'
                }
                res.json(user)
                // res.json({results : results})
            }
        })
    } else {
        res.json({error : 'not able to login'})
    }
}
//Register
// Req: username, email, password
// Res: success: save to db -> return “register successfully”
async function register(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    if (username && email && password) {
        connection.query(`
           INSERT INTO users (user_name, user_email, user_pass) VALUES ('${username}', '${email}', '${password}');`,
            function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({error : error})
            } else if (results) {
                res.json({message : "Successfully registered!"})
            }
        })
    } else {
        res.json({message: 'Unable to register'})
    }
}

module.exports = {
    search_keyword,
    search_type,
    search_similar,
    search_id,
    login,
    register
}