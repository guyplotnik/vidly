const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');
const auth = require('../middleware/auth');

async function createCustomer(isGold,name,phone){
    const customer = new Customer({
        isGold:isGold,
        name:name,
        phone:phone
    });
    await customer.save();
}

async function updateCustomer(id,isGold,name,phone){
    const customer = await Customer.findById(id);
    if (!customer) return;

    if(isGold) {
        customer.set({
            isGold:isGold
        });
    }
    if(name) {
        customer.set({
            name:name
        });
    }
    if(phone) {
        customer.set({
            phone:phone
        });
    }
    await customer.save();
}

async function removeCustomer(id){
    try{
        const result = await Customer.deleteOne({_id:id});
        res.send(result);
    }
    catch(err){
        res.status(404).send(err); 
    }
}


router.get('/',async(req,res)=> {
    const customers = await Customer
        .find({})
        .sort({name:1})
        .select({name:1});
    res.send(JSON.stringify(customers));
});


router.get('/:id',async(req,res)=> {
    const customer = await Customer
        .find({_id:req.params.id})
        .sort({name:1})
        .select({name:1});

    res.send(customer);
});

router.post('/',auth, (req,res)=>{
    const {error} = validate(req.body);        
    if (error)
        return res.status(400).send(error);

    createCustomer(req.body.isGold,req.body.name,req.body.phone);
    res.send([req.body.isGold,req.body.name,req.body.phone]);
});


router.put('/:id',auth, (req,res)=> {
    updateCustomer(req.params.id,req.body.isGold,req.body.name,req.body.phone);
    res.send([req.params.id,req.body.isGold,req.body.name,req.body.phone]);
});


router.delete('/:id',auth, (req,res)=> {
    const result = removeCustomer(req.params.id);
    res.send(result);
});

module.exports =router;

