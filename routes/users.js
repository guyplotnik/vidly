const Joi = require('joi');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');


router.post('/',auth, async (req,res)=>{
    const {error} = validate(req.body);        
    if (error)
        return res.status(400).send(error);

    let user = await User.findOne({email:req.body.email});
    if (user) return res.status(400).send('User already exists!');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    
    user = new User(
        {
            name:req.body.name,
            email:req.body.email,
            password:hashed
        });
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['name','email','passowrd']));
});


router.get('/me', auth, async(req,res) =>{
    const user1 = await User.findById(req.user._id).select('-password');
    res.send(user1);
});

exports.userRouter = router;

