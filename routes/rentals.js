const Joi = require('joi');
const express = require('express');
const router = express.Router();
const {Rental, validate} = require('../models/rental');
const {updateStock} = require('../routes/movies');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');


async function createRental(movieId, customerId, rentalDate){
    try{
        const rental = new Rental({
            movie:movieId,
            customer:customerId,
            rentalDate:rentalDate
        });
        await rental.save();
        await updateStock(movieId);
    }
    catch(e){
        console.log('error found:',e);
    }
}

router.get('/',async(req,res)=> {
    const rentals = await Rental
        .find({})
        .sort({rentalDate:1})
        .select({movie:1, customer:1, rentalDate:1});
    res.send(JSON.stringify(rentals));
});


router.get('/:id',async(req,res)=> {
    const rental = await Rental
        .find({_id:req.params.id})
        .select({movie:1, customer:1, rentalDate:1});

    res.send(rental);
});

router.post('/',auth, (req,res)=>{
   
    const {error} = validate(req.body);        
    if  (error)
        return res.status(400).send(error);
        
    createRental(req.body.movieId,req.body.customerId,req.body.rentalDate);
    res.send([req.body.movieId,req.body.customerId,req.body.rentalDate]);
});

module.exports =router;

