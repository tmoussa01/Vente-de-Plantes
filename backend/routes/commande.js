const { Commande, validate } = require('../models/commande');
const authentification = require('../middleware/authentification')
require("dotenv").config({ path: "./.env" });
// const admin = require('../middleware/admin')
const express = require('express');
const stripeSecretKey = process.env.STRIPE_PRIVATE;
const stripe = require("stripe")(stripeSecretKey);
const router = express.Router();


module.exports = router;

router.post('/', [authentification], async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let userID = req.user._id;
    console.log('user', userID)
    let status = "en suspens"
    let commande = new Commande(
        {
            num_phone: req.body.num_phone,
            statutCommande: status,
            num_carte: req.body.num_carte,
            nom_carte: req.body.nom_carte,
            montantTotal: req.body.montantTotal,
            prixEnvoi: req.body.prixEnvoi,
            expiration_carte: req.body.expiration_carte,
            adresse: req.body.adresse,
            userID: userID,

        },
        { new: true, useFindAndModify: false }
    );

    await commande.save();

    res.send(commande);
});


router.post('/checkoutSession', async (req, res) => {
    console.log('dans checkoutSession', req.body.checkoutProduct);

    try {
        const checkoutProduct = req.body.checkoutProduct;
        var i;
        var item1 = [];
        for (i = 0; i < checkoutProduct.length; i++) {
            item1.push(checkoutProduct[i]);
        }
        const session = await stripe.checkout.sessions.create({
            success_url:
                "http://localhost:8080/success-payment?id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:8080/cancel-payment",
            payment_method_types: ["card"],
            mode: "payment",
            line_items: item1,
            metadata: {
                customerName: req.body.customerName,
                customerPhoneNo: req.body.customerPhoneNo,
                shippingRue: req.body.shippingAddress.rue,
                shippingNumero: req.body.shippingAddress.numero,
                shippingPostal: req.body.shippingAddress.codePostal,
                shippingPays: req.body.shippingAddress.pays,
                carteProprio: req.body.carte.nomProprietaire,
                cartedateExpiration: req.body.carte.dateExpiration,
                carteNumero: req.body.carte.numero,
            },
            customer_email: req.body.customerEmail,
        });


        res.send(session.id)
        console.log("dans le try", session.id);
    } catch (err) {
        console.log("Erreur lors de la création de la session de paiement :", err);
        res.status(500).send({
            error: "Une erreur s'est produite lors de la tentative de paiement avec Stripe.",
        });
    }
});

router.get('/checkoutSessionRecup/:id', async (req, res) => {
    console.log('dans checkoutSessionRecup');
    console.log("checkoutSessionRecup", req.params.sessionId)
    try {

        const sessionId = req.params.id;
        console.log("sessionId", sessionId)
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items"],
        });
        res.send(session);
    } catch (err) {
        res.status(500).send({
            error: "An error occured when trying to retrieve checkout session.",
        });
    }
});
router.get('/All', [authentification], async (req, res) => {
    const Commande = await Commande
        .find()


    res.send(Commande)
})
