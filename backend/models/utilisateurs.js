const config = require('config');
const jwt = require('jsonwebtoken');

const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    prenom: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    dateNaissance: {
        type: String,
        required: false
    },
    img_profile: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    tokenInscription: {
        type: String,
        required: false
    },
    tokenResetPassword: {
        type: String,
        required: false
    }
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role.nom }, config.get('jwtPrivateKey'));
    return token;
}
const Utilisateur = mongoose.model('Utilisateur', userSchema);

const validateUser = (user) => {
    const schema = Joi.object().keys({
        nom: Joi.string().min(2).max(50).required(),
        prenom: Joi.string().min(2).max(50).required(),
        dateNaissance: Joi.string(),
        img_profile: Joi.string(),
        email: Joi.string().email().min(5).max(500).required(),
        password: Joi.string().min(8).max(1024).required(),
        role: Joi.required(),
        tokenInscription: Joi.string(),
        tokenResetPassword: Joi.string()
    }).unknown(false);
    return schema.validate(user, { abortEarly: false });
}

exports.Utilisateur = Utilisateur;
exports.validate = validateUser;