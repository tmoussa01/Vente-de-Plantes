const winston = require('winston');

module.exports = function (err, req, res, next) {
    winston.error(err.message, err);
    res.status(500).send('Quelque chose n a pas fonctionné correctement.')
}



