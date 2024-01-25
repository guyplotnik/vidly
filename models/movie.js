const mongoose = require('mongoose');
const {genreSchema} = require('../models/genre');
const Joi = require('joi');
const { number } = require('joi');

const Movie = mongoose.model('Movies', new mongoose.Schema({
        title:{
            type: String,
            required:true
        },
        genre:{
            type: genreSchema
        },
        numberInStock:{
            type: Number,
          
        },
        dailyRentalRate:{
            type: Number
        }
    })
);


function validateMovie(movie){
   const schema = Joi.object({
        title: Joi.string().min(3).required(),
        genreId: Joi.string().max(100),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    });

    
    return schema.validate(movie);
} 

exports.Movie = Movie;
exports.validate = validateMovie;