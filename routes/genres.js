const Joi = require('joi');
const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const winston = require('winston'); 
const mongoose = require('mongoose');


async function updateGenre(id, title){
    const genre = await Genre.findById(id);
    if (!genre) return;

    genre.set({
        name: title
    });

    await genre.save();
}


router.get('/', async (req,res)=> {
        const genres = await Genre
           .find({})
           .sort({name:1})
           .select({name:1});

        res.send(genres);
});


router.get('/:id',validateObjectId,async(req,res)=> {
    const genre = await Genre
        .find({_id:req.params.id})
        .sort({name:1})
        .select({name:1});
    if(!genre) return res.status(404).send('Genre was not found');
    res.send(genre);
});

router.post('/', auth, async (req,res)=>{
    
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const {error} = validate(req.body);        
    if (error)
        return res.status(400).send(error);

    
    const genre = new Genre({
        name:req.body.name
    });
    await genre.save();
    res.send(req.body.name);
});


router.put('/:id',auth, (req,res)=> {
    
    updateGenre(req.params.id,req.body.name);
    res.send([req.params.id,req.body.name]);
});



router.delete('/:id',[auth, admin],async (req,res)=> {
    try{
        const result = await Genre.deleteOne({_id:req.params.id});
        res.send(result);
    }
    catch(err){
        res.status(404).send(err); 
    }
    res.send(result);
});

module.exports =router;

