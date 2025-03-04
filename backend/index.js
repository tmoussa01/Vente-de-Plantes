const express = require('express');
const app = express();
const path = require('path');
let winston = require('winston')
require('dotenv').config({ path: ".env" })

const cors = require('cors');
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/images', express.static(path.join(__dirname, 'images')))

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`listening on port ${port}...`));

