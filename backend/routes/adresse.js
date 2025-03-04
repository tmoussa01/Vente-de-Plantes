const { Adresse, validate } = require('../models/adresse');
const authentification = require('../middleware/authentification')
// const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();


module.exports = router;

router.post('/', [authentification], async (req, res) => {
    console.log("dans adresse")
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log(req.body)
    let adresse = new Adresse(
        {
            rue: req.body.rue,
            numero: req.body.numero,
            code_postal: req.body.code_postal,
            pays: req.body.pays,

        },
        { new: true, useFindAndModify: false }
    );

    await adresse.save();

    res.send(adresse);
});