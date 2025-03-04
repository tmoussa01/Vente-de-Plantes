const Joi = require('joi');
const mongoose = require('mongoose');

const AvisSchema = new mongoose.Schema({
    plante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plantes'
    },
    etoile: {
        type: Number,
        default: 0
    },
    commentaire: {
        type: String,
        review: 'text',
        text: true,
        required: true,
        minlength: 5,
        maxlength: 1500
    },
    dateCreation: {
        type: Date,
        default: Date.now,
        required: true
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },
})
const Avis = mongoose.model('Avis', AvisSchema);

const validateAvis = (Avis) => {
    const schema = Joi.object({
        plante: Joi,
        etoile: Joi,
        commentaire: Joi,
        dateCreation: Joi.required,
        utilisateur: Joi
    })
    return schema.validate(Avis);
}

exports.Avis = Avis;
exports.validate = validateAvis;
