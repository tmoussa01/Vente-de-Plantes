const Joi = require('joi');
const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
    num_phone: {
        type: String,
        review: 'text',
        text: true,
        required: true,
        minlength: 9,
        maxlength: 20
    },
    statutCommande: {
        type: String,
        review: 'text',
        text: true,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    num_carte: {
        type: String,
        review: 'text',
        text: true,
        required: true,
        minlength: 16,
        maxlength: 20
    },
    nom_carte: {
        type: String,
        review: 'text',
        text: true,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    montantTotal: {
        type: Number,
        required: true
    },
    prixEnvoi: {
        type: Number,
        required: true
    },
    dateCreation: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiration_carte: {
        type: Date,
        required: true
    },
    adresse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adresse'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    }




});
const Commande = mongoose.model('Commande', CommandeSchema);

const validateCommande = (Commande) => {
    const schema = Joi.object({
        num_phone: Joi.string().min(9).max(20).required(),
        // statutCommande: Joi.string().min(3).max(20).required(),
        num_carte: Joi.string().min(16).max(20).required(),
        nom_carte: Joi.string().min(3).max(20).required(),
        montantTotal: Joi.number().required(),
        prixEnvoi: Joi.number().required(),
        // dateCreation: Joi.required(),
        expiration_carte: Joi.required(),
        adresse: Joi.required(),

    })
    return schema.validate(Commande)
}

exports.Commande = Commande;
exports.validate = validateCommande;