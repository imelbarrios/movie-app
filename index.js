const express = require('express');

const app = express();

const { config } = require('./config/index');

/**
 * Rutas de ejemplo
app.get('/', function (req, res) {
    res.send('hello world');
});

app.get('/json', function (req, res) {
    res.json({ hello: 'world' });
});

**/

const moviesApi = require('./routes/movies.js');

const { logErrors, errorHandler, wrapErrors } = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

// body parser
app.use(express.json());

// routes
moviesApi(app);

// Catch 404
app.use(notFoundHandler);

//Middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`listening address http://localhost:${config.port}`);
});
