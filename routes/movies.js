const Joi = require('joi');
const express = require('express');
const router = express.Router();
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

async function createMovie(title,genreId,numberInStock,dailyRentalRate){
    
    const movieGenre = await Genre.findById(genreId);
    const movie = new Movie({
        title:title,
        genre:{
            _id:movieGenre._id,
            name: movieGenre.name
        },
        numberInStock:numberInStock,
        dailyRentalRate:dailyRentalRate
    });
    await movie.save();
}

async function updateStock(id){
    const movie = await Movie.findById(id);
    if (!movie) return;
    const currentStock = movie.numberInStock-1;
    movie.set({
        numberInStock:currentStock
    });
    await movie.save();
}

async function updateMovie(id,title,genre,numberInStock,dailyRentalRate){
    const movie = await Movie.findById(id);
    if (!movie) return;

    if(title) {
        movie.set({
            title:title
        });
    }
    if(genre) {
        movie.set({
            genre:genre
        });
    }
    if(numberInStock) {
        movie.set({
            numberInStock:numberInStock
        });
    }
    if(dailyRentalRate) {
        movie.set({
            dailyRentalRate:dailyRentalRate
        });
    }
    await movie.save();
}

async function removeMovie(id){
    try{
        const result = await Movie.deleteOne({_id:id});
        res.send(result);
    }
    catch(err){
        res.status(404).send(err); 
    }
}


router.get('/',async(req,res)=> {
    const movies = await Movie
        .find({})
        .sort({title:1})
        .select({title:1, genre:1});
    res.send(JSON.stringify(movies));
});


router.get('/:id',async(req,res)=> {
    const movie = await Movie
        .find({_id:req.params.id})
        .sort({title:1})
        .select({title:1, genre:1});

    res.send(movie);
});

router.post('/',auth, (req,res)=>{
   
    const {error} = validate(req.body);        
    if (error)
        return res.status(400).send(error);

    createMovie(req.body.title,req.body.genreId,req.body.numberInStock,req.body.dailyRentalRate);
    res.send(req.body.title);
});


router.put('/:id',auth, (req,res)=> {
    
    updateMovie(req.params.id,req.body.title,req.body.genre,req.body.numberInStock,req.body.dailyRentalRate);
    res.send([req.params.id,req.body.title,req.body.genre,req.body.numberInStock,req.body.dailyRentalRate]);
});



router.delete('/:id',auth, (req,res)=> {
    const result = removeMovie(req.params.id);
    res.send(result);
});

exports.movieRouter = router;
exports.updateStock = updateStock;

