const express = require('express');
const mysql = require('mysql');


const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');


const app = express();
app.use(cors({
    origin: '*'
}));

// Route registeration
app.get('/search/keyword', routes.search_keyword)

app.get('/search/type', routes.search_type)

app.get('/search/similar_movie', routes.search_similar)

app.get('/search/id', routes.search_id)




app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;