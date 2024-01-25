const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold:{
        type: Boolean,
        required:false,
        default:false
        },
    name:{
        type: String,
        required:true,
        minlength:3,
        maxlength:50
        },
    phone:{
        type: String,
        required:false,
        minlength:7,
        maxlength:50
        }
    })
);



function validateCustomer(customer){
    const schema = Joi.object({
       
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(7)
    });
    
    return schema.validate(customer);
} 

exports.Customer = Customer;
exports.validate = validateCustomer;