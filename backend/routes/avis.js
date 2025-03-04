const { Avis } = require('../models/avis');
const authentification = require('../middleware/authentification')
// const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();


module.exports = router;

router.post('/', [authentification], async (req, res) => {
    console.log("dans avis")
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let userID = req.user._id;
    let avis = new Avis(
        {
            plante: req.body.planteID,
            etoile: req.body.etoile,
            commentaire: req.body.commentaire,
            utilisateur: userID,

        },
        { new: true, useFindAndModify: false }
    );

    await avis.save();

    res.send(avis);
});