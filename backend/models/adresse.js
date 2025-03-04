const mongoose = require('mongoose');

/* Joi est une bibliothèque de validation  */
const Joi = require('joi');

const AdresseSchema = new mongoose.Schema({
    rue: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,

    },
    numero: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10,

    },
    code_postal: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10,

    },
    pays: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20,

    },
});

const Adresse = mongoose.model('Adresse', AdresseSchema);

const validateAdresse = (Adresse) => {
    const schema = Joi.object({
        rue: Joi.string().min(3).max(40).required(),
        numero: Joi.string().min(1).max(10).required(),
        code_postal: Joi.string().min(1).max(10).required(),
        pays: Joi.string().min(1).max(20).required(),
    })
    return schema.validate(Adresse);
}

exports.Adresse = Adresse;
exports.validate = validateAdresse;

