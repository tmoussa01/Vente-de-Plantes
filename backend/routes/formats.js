const { Format, validate } = require('../models/format');
const authentification = require('../middleware/authentification')
const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();


router.post('/', [authentification, admin], async (req, res) => {
    console.log("dans ajouter format")
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let form = await Format.findOne({ nom: req.body.nom });
    if (form) return res.status(400).send('ce nom de Format existe déjà');


    console.log("dans ajouter format2")
    let format = new Format({ nom: req.body.nom })
    format = await format.save();

    res.send(format);

})
// tous les format
router.get('/All', async (req, res) => {
    const form = await Format.find();
    res.send(form)
})
// get  form by id
router.get('/:id', async (req, res) => {
    const form = await Format.findById(req.params.id);

    if (!form) return res.status(404).send('le format avec l id indiqué n a pas été retrouvée.');

    res.send(form);
})
// get form by page 
router.get('/formByPage/:Page', async (req, res) => {
    console.log('dans formByPage')
    console.log('pageNumber', req.params.Page)
    const pageNumber = req.params.Page;
    const pageSize = 3;//nbr d'elelment dans la page
    const form = await Format
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    console.log('form', form)

    res.send(form)

})
// edit form by id
router.put('/:id', [authentification, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let form = await Format.findOne({ nom: req.body.nom });
    if (form) return res.status(400).send('ce nom de Format existe déjà');

    const forma = await Format.findByIdAndUpdate(req.params.id,
        { nom: req.body.nom },
        { new: true, useFindAndModify: false });

    if (!forma) return res.status(404).send("le Format avec l id indiqué n a pas été retrouvée.");

    res.send(forma);
})
// remove one cat by id

router.delete('/:id', [authentification, admin], async (req, res) => {
    const form = await Format.findByIdAndRemove(req.params.id,
        { useFindAndModify: false });


    if (!form) {
        return res.status(404).send("le format avec l id indiqué n a pas été retrouvée.");
    }

    res.send(form);

})



module.exports = router;