const { WishList } = require('../models/wishList');
const authentification = require('../middleware/authentification')

const express = require('express');
const router = express.Router();


module.exports = router;

router.post('/', [authentification], async (req, res) => {
    console.log("plante ", req.body.id)
    let userID = req.user._id;
    let plante = req.body.id


    let dansDb = await WishList.findOne({
        utilisateur: userID,
        plante: plante
    })
    console.log("dansDb", dansDb)
    if (dansDb) return res.status(400).send('WishList déjà enregistré.');
    if (dansDb === null) {
        let wishList = new WishList({
            utilisateur: userID,
            plante: plante
        }, { new: true, useFindAndModify: false });
        await wishList.save();
    }

});

router.delete('/:id', [authentification], async (req, res) => {
    let userID = req.user._id;
    const wishList = await WishList.findOneAndRemove({ plante: req.params.id, utilisateur: userID },
        { useFindAndModify: false });
    if (!wishList) return res.status(404)
        .send('la wishList avec l id indiqué n a pas été retrouvée.');

    res.send(wishList)
})

router.get('/All', [authentification], async (req, res) => {
    let userID = req.user._id;
    const WishList = await WishList
        .find({ utilisateur: userID })
        .populate('plante', 'nom description prix plante_img etoile ')

    res.send(WishList)
})

router.get('/WishListByPage/:Page', [authentification], async (req, res) => {
    let userID = req.user._id;
    const pageNumber = req.params.Page;
    const pageSize = 5;

    const wishListItems = await WishList
        .find({ utilisateur: userID })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('plante', 'nom description prix plante_img etoile ');

    res.send(wishListItems);
});

router.get('/:id', [authentification], async (req, res) => {
    let userID = req.user._id;
    let resultat = await WishList.findOne({
        utilisateur: userID,
        plante: req.params.id
    })

    if (resultat === null) {
        res.send(false)
    } else {
        res.send(true)
    }



})

