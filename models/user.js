const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
        },
    email:{
        type: String,
        required:true,
        unique: true
        },
    password:{
        type: String,
        required:true,
        minlength:7,
        maxlength:150
        },
    isAdmin:{
        type:Boolean
    }
    });

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema);



function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(7)
    });
    
    return schema.validate(user);
} 

exports.User = User;
exports.validate = validateUser;