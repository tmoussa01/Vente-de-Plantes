const categories = require('../routes/categories');
const formats = require('../routes/formats');
const role = require('../routes/role');
const plantes = require('../routes/plantes');
const utilisateurs = require('../routes/utilisateurs');
const wishList = require('../routes/wishList');
const Avis = require('../routes/avis');
const Adresse = require('../routes/adresse');
const Commande = require('../routes/commande');
const Ligne_Commande = require('../routes/ligne_commande');
const authentification = require('../routes/authentification');
const machine_learning = require('../routes/machine_learning');
const express = require('express');
const error = require('../middleware/error');


module.exports = function (app) {
    app.use(express.json());
    app.use('/api/categories', categories);
    app.use('/api/format', formats);
    app.use('/api/role', role);
    app.use('/api/plantes', plantes);
    app.use('/api/utilisateurs', utilisateurs);
    app.use('/api/wishList', wishList);
    app.use('/api/avis', Avis);
    app.use('/api/adresse', Adresse);
    app.use('/api/commande', Commande);
    app.use('/api/ligne_commande', Ligne_Commande);
    app.use('/api/authentification', authentification);
    app.use('/api/machine_learning', machine_learning);


    app.use(error);
}