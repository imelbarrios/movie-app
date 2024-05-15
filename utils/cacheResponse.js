const { config } = require('../config');

function cacheResponse(res, seconds) {
    if (!config.dev) {
        //if (!process.env.NODE_ENV) {
        res.set('Cache-Control', `public, max-age=${seconds}`);
    }
}

module.exports = cacheResponse;