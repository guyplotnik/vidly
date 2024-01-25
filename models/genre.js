const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
        name: {
            type: String,
            required:true,
            minlength:3,
            maxlength:50
        }
    });

const Genre = mongoose.model('Genres', genreSchema);

function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
    
} 


exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;