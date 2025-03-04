const mongoose = require('mongoose');

/* Joi est une bibliothèque de validation  */
const Joi = require('joi');

const CategoriesSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
        unique: true
    }
});

const Categories = mongoose.model('Categories', CategoriesSchema);

const validateCategories = (categories) => {
    const schema = Joi.object({
        nom: Joi.string().min(3).max(40).required(),
    })
    return schema.validate(categories);
}

exports.Categories = Categories;
exports.validate = validateCategories;

