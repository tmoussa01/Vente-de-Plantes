const { Ligne_commande, validate } = require('../models/ligne_commande');
const authentification = require('../middleware/authentification')
// const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();


module.exports = router;

router.post('/', [authentification], async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let ligne_commande = new Ligne_commande(
        {
            quantite: req.body.quantite,
            Commande: req.body.Commande,
            plante: req.body.plante,

        },
        { new: true, useFindAndModify: false }
    );

    await ligne_commande.save();

    res.send(ligne_commande);
});