const express = require('express');
//const { moviesMock } = require('../utils/mocks/movies');
const MoviesService = require('../services/movies');

const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');

//Cache
const cacheResponse = require('../utils/cacheResponse');
const {
    FIVE_MINUTES_IN_SECONDS,
    SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');


function moviesApi(app) {
    const router = express.Router();
    app.use('/api/movies', router);

    const moviesService = new MoviesService();

    router.get('/', async function (req, res, next) {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
        const { tags } = req.query;
        try {
            //            const movies = await Promise.resolve(moviesMock);
            const movies = await moviesService.getMovies({ tags });
            //throw new Error('eRROR GETTIND'); //PROBAR MIDDLEWARE

            res.status(200).json({
                data: movies,
                message: 'movies listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
        const { movieId } = req.params;
        try {
            // const movies = await Promise.resolve(moviesMock[0]);
            const movies = await moviesService.getMovie({ movieId });

            res.status(200).json({
                data: movies,
                message: 'movie retrieved'
            });
        } catch (err) {
            next(err);
        }
    });


    router.post('/', validationHandler(createMovieSchema), async function (req, res, next) {
        const { body: movie } = req;
        try {
            //    const createdMovieId = await Promise.resolve(moviesMock[0].id);
            const createdMovieId = await moviesService.createMovie({ movie });

            res.status(201).json({
                data: createdMovieId,
                message: 'movie created'
            });
        } catch (err) {
            next(err);
        }
    });


    router.put('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
        const { movieId } = req.params;
        const { body: movie } = req;

        try {
            //            const updatedMovieId = await Promise.resolve(moviesMock[0].id);
            const updatedMovieId = await moviesService.updateMovie({ movieId, movie });

            res.status(200).json({
                data: updatedMovieId,
                message: 'movie updated'
            });
        } catch (err) {
            next(err);
        }
    });

    router.delete('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        const { movieId } = req.params;
        try {
            //   const deletedMovieId = await Promise.resolve(moviesMock[0].id);
            const deletedMovieId = await moviesService.deleteMovie({ movieId });

            res.status(200).json({
                data: deletedMovieId,
                message: 'movie deleted'
            });
        } catch (err) {
            next(err);
        }
    });

    /* router.patch('/:movieId', async function (req, res, next) {
         const { movieId } = req.params;
         const { body: movie } = req;
 
         try {
             const patchMovieId = await moviesService.resolve({ movieId, movie });
 
             res.status(200).json({
                 data: patchMovieId,
                 message: 'movie updated patch'
             });
         } catch (err) {
             next(err);
         }
 
 
     });*/


}

module.exports = moviesApi;