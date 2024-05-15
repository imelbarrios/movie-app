const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MoviesServiceMock } = require('../utils/mocks/movies.js');
const testServer = require('../utils/testServer');

describe('routes - movies', function () {
    const route = proxyquire('../routes/movies', {
        '../services/movies': MoviesServiceMock
    });

    const request = testServer(route);

    describe('GET /movies', function () {
        it('should respond with status 200', function (done) {
            request.get('/api/movies').expect(200, done);
        });

        it('should respond with the list of movies', function (done) {
            request.get('/api/movies').end((err, res) => {
                assert.deepEqual(res.body, {
                    data: moviesMock,
                    message: 'movies listed'
                });

                done();
            });
        });
    });

    describe('GET /movies/:movieId', function () {
        const movieId = moviesMock[0].id;
        it('should respond with status 200', function (done) {
            request
                .get('/api/movies/' + movieId)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('should respond with the retrieved movie', function (done) {
            request
                .get('/api/movies/' + movieId)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    assert.deepEqual(res.body, {
                        data: moviesMock.find((movie) => movie.id === movieId),
                        message: 'movie retrieved',
                    });
                    done();
                });
        });
    });

    describe('POST /movies', function () {
        it('Should respond with status 201', function (done) {
            request.post('/api/movies').expect(201, done);
        });

        it('Should respond with the movie created id', function (done) {
            request
                .post('/api/movies')
                .send(moviesMock[1])
                .end((err, res) => {
                    assert.deepEqual(res.body, {
                        data: moviesMock[0].id,
                        message: 'Movie created',
                    });

                    done();
                });
        });
    });


});