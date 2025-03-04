const Joi = require('joi');
const mongoose = require('mongoose');

const WishListSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },
    plante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plantes'
    },
})
const WishList = mongoose.model('WishList', WishListSchema);

const validateWishList = (WishList) => {
    const schema = Joi.object({
        utilisateur: Joi,
        plante: Joi,
    })
    return schema.validate(WishList);
}

exports.WishList = WishList;
exports.validate = validateWishList;
