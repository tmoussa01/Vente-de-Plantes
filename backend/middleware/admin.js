const { Utilisateur } = require('../models/utilisateurs');
const { Role } = require('../models/role');

module.exports = async function (req, res, next) {
    console.log('administrateur?', req.user)
    let utilisateur = await Utilisateur.findOne({ _id: req.user });
    let role = await Role.findById(utilisateur.role);
    let nomRole = role
    console.log("nomRole", nomRole.nom)
    if (req.user && nomRole.nom === "admin") {
        next();
    } else {
        // L'utilisateur n'a pas le rôle "admin", renvoyez une réponse 403 (Accès refusé).
        return res.status(403).send('Accès refusé. Cette action est uniquement disponible pour les administrateurs.');
    }
};