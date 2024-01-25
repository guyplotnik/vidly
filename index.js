const express = require('express');
const winston = require('winston');
var app = express(); 


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

console.log(process.env.NODE_ENV);
const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`listening on port ${port}...`));

module.exports = server;