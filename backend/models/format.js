const mongoose = require('mongoose');

/* Joi est une bibliothèque de validation  */
const Joi = require('joi');

const FormatSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
        unique: true
    }
});

const Format = mongoose.model('Format', FormatSchema);

const validateFormats = (format) => {
    const schema = Joi.object({
        nom: Joi.string().min(3).max(40).required(),
    })
    return schema.validate(format);
}

exports.Format = Format;
exports.validate = validateFormats;

