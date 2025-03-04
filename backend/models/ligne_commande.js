const Joi = require('joi');
const mongoose = require('mongoose');

const Ligne_commandeSchema = new mongoose.Schema({

    quantite: {
        type: Number,
        required: true
    },
    Commande: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commande'
    },
    plante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plantes'
    }




});
const Ligne_commande = mongoose.model('Ligne_commande', Ligne_commandeSchema);

const validateCommande = (Ligne_commande) => {
    const schema = Joi.object({
        quantite: Joi.number().required(),
        Commande: Joi.required(),
        plante: Joi.required(),

    })
    return schema.validate(Ligne_commande)
}

exports.Ligne_commande = Ligne_commande;
exports.validate = validateCommande;