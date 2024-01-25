const express = require('express');
const error = require('../middleware/error');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const {movieRouter} = require('../routes/movies');
const {userRouter} = require('../routes/users');
const {auth} = require('../routes/auth');
const rentals = require('../routes/rentals');
const home = require('../routes/home');

module.exports = function(app){
app.use(error);
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movieRouter);
app.use('/api/rentals', rentals);
app.use('/api/users', userRouter);
app.use('/api/auth', auth);
app.use('/', home);


app.set('view engine','pug');
app.set('views','./views');
}