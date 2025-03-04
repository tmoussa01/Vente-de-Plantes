const config = require('config');

module.exports = function () {

    if (!config.get('jwtPrivateKey')) {
        console.error('Fatal Error: jwt clé privée n est pas défini');
        process.exit(1);
    }
}