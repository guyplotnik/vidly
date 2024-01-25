const mongoose = require('mongoose');
const Joi = require('joi');
const {updateStock} = require('../routes/movies');
const { number, date, string } = require('joi');

const Rental = mongoose.model('Rentals', new mongoose.Schema({
        movie:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Movie',
            required:true
        },
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Customer',
            required:true
        },
        rentalDate:{
            type: Date
        }
    })
);



function validateRental(rental){
   const schema = Joi.object({
        movieId: Joi.string().min(5).required(),
        customerId: Joi.string().min(5).required(),
        rentalDate: Joi.date()
    });

    return schema.validate(rental);
} 

exports.Rental = Rental;
exports.validate = validateRental;