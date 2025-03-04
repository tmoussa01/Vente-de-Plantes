const { Plantes, validate } = require('../models/plantes');
const authentification = require('../middleware/authentification')
const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();
const imgUpload = require('./imgUpload');// utiliser comme un middleware


module.exports = router;


// add new plante
router.post('/', [authentification, admin], imgUpload, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let plante = await Plantes.findOne({ nom: req.body.nom });
    if (plante) return res.status(400).send('plante déjà enregistré.');

    let plante_image = '';
    if (req.file && req.file !== '') {
        const URL = req.protocol + "://" + req.get("host");
        plante_image = URL + "/images/" + req.file.filename;
    } else {
        plante_image = req.body.profile_img;
    }

    plante = new Plantes(
        {
            nom: req.body.nom,
            description: req.body.description,
            prix: req.body.prix,
            plante_img: plante_image,
            plante_categories: req.body.plante_categories,
            plante_formats: req.body.plante_formats,
            quantite: req.body.quantite,
            etoile: req.body.etoile,
            nbrVote: req.body.nbrVote,
            nbrVente: req.body.nbrVente,

        },
        { new: true, useFindAndModify: false }
    );

    await plante.save();

    res.send(plante);
});
// edit plante
router.put('/:id', [authentification, admin], imgUpload, async (req, res) => {
    let plante_image = '';
    if (req.file && req.file !== '') {
        const URL = req.protocol + "://" + req.get("host");
        plante_image = URL + "/images/" + req.file.filename;
    } else {
        plante_image = req.body.profile_img;
    }

    let plante = await Plantes.findByIdAndUpdate(req.params.id,
        {
            nom: req.body.nom,
            description: req.body.description,
            prix: req.body.prix,
            plante_img: plante_image,
            plante_categories: req.body.plante_categories,
            plante_formats: req.body.plante_formats,
            quantite: req.body.quantite,
        },
        { new: true, useFindAndModify: false }
    );

    if (!plante) return res.status(404).send('cette plante n existe plus dans la db')

    res.send(plante);
});
router.put('/venteQuantite/:id', [authentification], async (req, res) => {
    console.log("venteQuantite")
    console.log("req.body", req.body)
    let plante = await Plantes.findByIdAndUpdate(req.params.id,
        {

            nbrVente: req.body.nbrVente,
            quantite: req.body.quantite,
        },
        { new: true, useFindAndModify: false }
    );

    if (!plante) return res.status(404).send('cette plante n existe plus dans la db')

    res.send(plante);
});

// get all plante 
router.get('/All', async (req, res) => {
    const Plante = await Plantes
        .find()
        .populate('plante_categories', 'nom')
        .populate('plante_formats', 'nom');

    res.send(Plante)
})
// get one plante 

router.get('/:id', async (req, res) => {
    const Plante = await Plantes.findById(req.params.id)
        .populate('plante_categories', 'nom')
        .populate('plante_formats', 'nom')

    if (!Plante) return res.status(404)
        .send('la plante avec l id indiqué n a pas été retrouvée.')


    res.send(Plante)
})

// get plante by page 
router.get('/PlanteByPage/:Page', async (req, res) => {
    const pageNumber = req.params.Page;
    const pageSize = 5;
    const PLante = await Plantes
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('plante_categories', 'nom')
        .populate('plante_formats', 'nom')

    res.send(PLante)
})
router.post('/PlanteByCat/:Page', async (req, res) => {
    const pageNumber = req.params.Page;
    const pageSize = 5;
    console.log('dans plantecatid')
    const prod = await Plantes
        .find({ plante_categories: req.body.cat })
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('plante_categories', 'nom')
        .populate('plante_formats', 'nom')


    res.send(prod);

});
router.post('/PlanteByFormat/:Page', async (req, res) => {
    const pageNumber = req.params.Page;
    const pageSize = 5;
    console.log('dans PlanteByFormat')
    const prod = await Plantes
        .find({ plante_formats: req.body.format })
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('plante_categories', 'nom')
        .populate('plante_formats', 'nom')

    console.log('plante_formats', prod)
    res.send(prod);

});
router.post('/PlanteByCatAndFormat/:Page', async (req, res) => {
    const pageNumber = req.params.Page;
    const pageSize = 5;
    const catSelections = req.body.cat; // Tableau des catégories sélectionnées
    const formatSelections = req.body.format; // Tableau des formats sélectionnés

    // Construire la requête en fonction des catégories et des formats sélectionnés
    const query = {
        $and: [
            { plante_categories: { $in: catSelections } }, // Recherche de catégories sélectionnées
            { plante_formats: { $in: formatSelections } }  // Recherche de formats sélectionnés
        ]
    };

    try {
        const planteData = await Plantes
            .find(query)
            .sort({ _id: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .populate('plante_categories', 'nom')
            .populate('plante_formats', 'nom');

        res.send(planteData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la recherche.');
    }
});
// delete one plante
router.delete('/:id', [authentification, admin], async (req, res) => {
    const plante = await Plantes.findByIdAndRemove(req.params.id,
        { useFindAndModify: false });
    if (!plante) return res.status(404)
        .send('la plante avec l id indiqué n a pas été retrouvée.');

    res.send(plante)
})
router.get('/recherche/:SearchData', async (req, res) => {
    console.log('dans search ', req.params.SearchData)

    let regex = new RegExp(req.params.SearchData, 'i');

    const SearchResult = await Plantes
        .find({ $or: [{ nom: regex }, { description: regex }] })
        .limit(6);
    res.send(SearchResult);
})