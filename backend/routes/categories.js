const { Categories, validate } = require('../models/categories');
const authentification = require('../middleware/authentification')
const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();


// ajouter nv categorie
router.post('/', [authentification, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let cat = await Categories.findOne({ nom: req.body.nom });
    if (cat) return res.status(400).send('ce nom de Catégorie existe déjà');



    let categorie = new Categories({ nom: req.body.nom })
    categorie = await categorie.save();

    res.send(categorie);

})
// tous les categories
router.get('/All', async (req, res) => {
    const Cat = await Categories.find();
    res.send(Cat)
})
// get  categorie by id
router.get('/:id', async (req, res) => {
    const cat = await Categories.findById(req.params.id);

    if (!cat) return res.status(404).send('la catégorie avec l id indiqué n a pas été retrouvée.');

    res.send(cat);
})
// get cat by page 
router.get('/CatByPage/:Page', async (req, res) => {
    const pageNumber = req.params.Page;
    const pageSize = 3;//nbr d'elelment dans la page
    const Cat = await Categories
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

    res.send(Cat)

})
// edit cat by id
router.put('/:id', [authentification, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let cate = await Categories.findOne({ nom: req.body.nom });
    if (cate) return res.status(400).send('ce nom de Catégorie existe déjà');

    const cat = await Categories.findByIdAndUpdate(req.params.id,
        { nom: req.body.nom },
        { new: true, useFindAndModify: false });

    if (!cat) return res.status(404).send("la catégorie avec l id indiqué n a pas été retrouvée.");

    res.send(cat);
})
// remove one cat by id

router.delete('/:id', [authentification, admin], async (req, res) => {
    const cat = await Categories.findByIdAndRemove(req.params.id,
        { useFindAndModify: false });


    if (!cat) {
        return res.status(404).send("la catégorie avec l id indiqué n a pas été retrouvée.");
    }

    res.send(cat);

})



module.exports = router;