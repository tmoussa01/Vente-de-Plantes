const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = /* fonction d'intergiciel utilisée pour vérifier un jeton Web JSON (JWT) envoyé dans l'en-tête d'une requête HTTP.
l'en-tête d'une requête HTTP. Elle prend en compte trois paramètres : `req` (l'objet request
demande), `res` (l'objet réponse), et `next` (une fonction de rappel pour passer à la
la fonction suivante de l'intergiciel). */
    function (req, res, next) {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401)
                .send('Accès refusé. Aucun token na été fourni.');
        }
        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.user = decoded;
            next();
        } catch (ex) {
            res.status(400).send('token invalide.');
        }
    }