
const imgUpload = require('./imgUpload');

const { Utilisateur } = require('../models/utilisateurs');
const authentification = require('../middleware/authentification')
const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();






router.get('/me', authentification, async (req, res) => {
    const utilisateur = await Utilisateur.findById(req.user._id)
        .select('-password');
    res.send(utilisateur);
})
router.get('/:Page', async (req, res) => {
    const nbrPage = req.params.Page;
    const pageSize = 2;

    const utilisateur = await Utilisateur
        .find()
        .skip((nbrPage - 1) * pageSize)
        .limit(pageSize);

    res.send(utilisateur);
});
router.put('/', authentification, imgUpload, async (req, res) => {
    let imgProfile = '';
    if (req.file && req.file !== '') {
        const URL = req.protocol + "://" + req.get("host");
        imgProfile = URL + "/images/" + req.file.filename;
    } else {
        imgProfile = req.body.profile_img;
    }

    const utilisateur = await Utilisateur.findByIdAndUpdate(req.user._id,
        {
            nom: req.body.nom,
            prenom: req.body.prenom,
            img_profile: imgProfile,
            dateNaissance: req.body.dateNaissance,
        }, { new: true, useFindAndModify: false })

    if (!utilisateur) {
        return res.status(404).send('cet utilisateur n est plus dans la db')
    }
    res.send(utilisateur);
})


router.put('/Role', [authentification, admin], async (req, res) => {
    const utilisateur = await Utilisateur.findByIdAndUpdate(req.body._id,
        { role: req.body.role }, { new: true, useFindAndModify: false })

    if (!utilisateur) return res.status(404).send('cette utilisateur n est plus dans la db')

    res.send(utilisateur)
});


router.delete('/', authentification, async (req, res) => {
    const utilisateur = await Utilisateur.findByIdAndRemove(req.user._id,
        { new: true, useFindAndModify: false })

    if (!utilisateur) return res.status(404).send('cette utilisateur n est plus dans la db')

    res.send(utilisateur)
});







module.exports = router;