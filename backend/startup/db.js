const mongoose = require('mongoose');
let winston = require('winston')
require('dotenv').config({ path: "./.env" })
module.exports = function () {


    mongoose.connect('mongodb://localhost/' + process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => winston.info('connected to MongoDB'))
        .catch(err => console.error('could not connect to MongoDB...'))
}


