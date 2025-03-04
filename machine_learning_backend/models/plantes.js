const Joi = require('joi');
const mongoose = require('mongoose');

const PlantesSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        review: 'text',
        text: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    description: {
        type: String,
        review: 'text',
        text: true,
        required: true,
        minlength: 5,
        maxlength: 1500
    },
    prix: {
        type: Number,
        required: true
    },
    plante_img: {
        type: String,
        required: false
    },
    plante_categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    plante_formats: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Format'
    },
    etoile: {
        type: Number,
    },
    nbrVote: {
        type: Number,
    },
    nbrVente: {
        type: Number
    },
    quantite: {
        type: Number,
        required: true
    }

});
const Plantes = mongoose.model('Plantes', PlantesSchema);

const validatePlantes = (plantes) => {
    const schema = Joi.object({
        nom: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(1500).required(),
        prix: Joi.number().required(),
        plante_categories: Joi.required(),
        plante_formats: Joi.required(),
        plante_img: Joi.string(),
        etoile: Joi.number(),
        nbrVote: Joi.number(),
        nbrVente: Joi.number(),
        quantite: Joi.number().required(),
    })
    return schema.validate(plantes)
}

exports.Plantes = Plantes;
exports.validate = validatePlantes;