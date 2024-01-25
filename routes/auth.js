const Joi = require('joi');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const winston = require('winston');

router.post('/', async (req,res)=>{
    const {error} = validateAuth(req.body);        
    if (error) return res.status(400).send(error);

    let user = await User.findOne({email:req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(req){
    
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(7)
    });
    
    return schema.validate(req);
} 

exports.auth = router;

