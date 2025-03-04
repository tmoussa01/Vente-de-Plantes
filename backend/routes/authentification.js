const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Utilisateur, validate } = require('../models/utilisateurs');
const { Role } = require('../models/role');
const express = require('express');
const nodemailer = require('nodemailer');
const _ = require('lodash');
require('dotenv').config({ path: './.env' });

const router = express.Router();

// Fonction utilitaire pour envoyer des e-mails
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Outlook365',
        host: 'smtp-mail.outlook.com',
        secureConnection: false,
        port: '587',
        tls: { cciphers: 'SSLv3', rejectUnauthorized: false },
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = { from: process.env.EMAIL, to, subject, text };
    await transporter.sendMail(mailOptions);
};

// Validation des informations de connexion
const validateCredentials = (req) => {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(500).required(),
        password: Joi.string().min(8).max(1024).required(),
    });
    return schema.validate(req);
};

// Route de connexion
router.post('/', async (req, res) => {
    const { error } = validateCredentials(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const utilisateur = await Utilisateur.findOne({ email: req.body.email });
    if (!utilisateur || !(await bcrypt.compare(req.body.password, utilisateur.password))) {
        return res.status(400).send('Mot de passe ou email invalide');
    }

    if (utilisateur.tokenInscription) {
        const verificationLink = `http://localhost:8080/verification?email=${utilisateur.email}&id=${utilisateur._id}&token=${utilisateur.tokenInscription}`;
        await sendEmail(
            utilisateur.email,
            'Validation de l\'email pour se connecter',
            `Bonjour ${utilisateur.nom} ${utilisateur.prenom},\n\nPour pouvoir vous connecter, vous devez d'abord activer votre compte. Cliquez sur ce lien : ${verificationLink}`
        );
        return res.status(403).send('Un e-mail a été envoyé pour activer votre compte.');
    }

    res.send(utilisateur.generateAuthToken());
});

// Route d'inscription
router.post('/signup', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const existingUser = await Utilisateur.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).send('Utilisateur déjà inscrit');

        req.body.role = await Role.findOne({ nom: 'customer' });
        const utilisateur = new Utilisateur(_.pick(req.body, ['nom', 'prenom', 'dateNaissance', 'email', 'password', 'role']));
        utilisateur.password = await bcrypt.hash(utilisateur.password, 10);
        utilisateur.tokenInscription = Math.floor(10000 + Math.random() * 90000).toString();
        await utilisateur.save();

        await sendEmail(
            utilisateur.email,
            'Validation de l\'email',
            `Bonjour ${utilisateur.nom} ${utilisateur.prenom},\n\nVotre code de vérification est : ${utilisateur.tokenInscription}`
        );

        res.send(_.pick(utilisateur, ['_id', 'nom', 'prenom', 'email', 'role']));
    } catch (err) {
        console.error(err);
        res.status(500).send('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
});

// Route pour vérifier le token d'inscription
router.post('/checkToken', async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ email: req.body.email });
    if (!utilisateur) return res.status(404).send('Email invalide');

    const response = { id: utilisateur._id, statutCompteActive: !utilisateur.tokenInscription };
    if (utilisateur.tokenInscription) {
        await sendEmail(
            utilisateur.email,
            'Code de validation de votre email',
            `Bonjour ${utilisateur.nom} ${utilisateur.prenom},\n\nVotre code de vérification est : ${utilisateur.tokenInscription}`
        );
    }

    res.send(response);
});

// Route pour vérifier le token d'inscription et générer un token d'authentification
router.post('/verificationToken', async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ _id: req.body.id });
    if (!utilisateur || utilisateur.tokenInscription !== req.body.registerToken) {
        return res.status(403).send('Code invalide');
    }

    const token = utilisateur.generateAuthToken();
    res.send(token);
});

// Route pour réinitialiser le mot de passe
router.post('/resetPassword', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const utilisateur = await Utilisateur.findByIdAndUpdate(req.body.id, {
        password: req.body.password,
        tokenResetPassword: '',
    }, { new: true });

    await sendEmail(
        utilisateur.email,
        'Mot de passe réinitialisé',
        `Bonjour ${utilisateur.nom} ${utilisateur.prenom},\n\nVotre mot de passe a été réinitialisé avec succès.`
    );

    res.send(utilisateur);
});

// Route pour envoyer un e-mail de réinitialisation de mot de passe
router.post('/restpassEmail', async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ email: req.body.email });
    if (!utilisateur) return res.status(403).send('Cet email n\'est pas enregistré.');

    const resetToken = Math.floor(10000 + Math.random() * 90000).toString();
    await Utilisateur.findByIdAndUpdate(utilisateur._id, { tokenResetPassword: resetToken });

    const resetLink = `http://localhost:8080/resetPassword?email=${utilisateur.email}&token=${resetToken}`;
    await sendEmail(
        utilisateur.email,
        'Réinitialisation du mot de passe',
        `Bonjour,\n\nCliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`
    );

    res.send('Un e-mail de réinitialisation a été envoyé.');
});

// Route pour réinitialiser le token d'inscription
router.post('/resetToken', async (req, res) => {
    const utilisateur = await Utilisateur.findByIdAndUpdate(req.body.id, { tokenInscription: '' });
    await sendEmail(
        utilisateur.email,
        'Confirmation de validation de votre compte',
        `Bonjour ${utilisateur.nom} ${utilisateur.prenom},\n\nVotre email est vérifié, votre compte est maintenant activé.`
    );

    res.send(utilisateur);
});

module.exports = router;
