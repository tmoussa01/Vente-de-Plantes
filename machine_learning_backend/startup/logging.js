require('express-async-errors');
let winston = require('winston');

module.exports = function () {
    // uncaughtException
    process.on('uncaughtException', (ex) => {
        console.log('uncaughtException:backend');
        winston.error(ex.message, ex);
        process.exit(1);
    })

    // unhandledRejection
    process.on('unhandledRejection', (ex) => {
        console.log('unhandledRejection:backend');
        winston.error(ex.message, ex);
        process.exit(1);
    })


}












