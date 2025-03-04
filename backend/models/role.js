const mongoose = require('mongoose');
const Joi = require('joi');
const roleSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
        unique: true,
    }

});


const Role = mongoose.model('Role', roleSchema);
const validateRole = (role) => {
    const schema = Joi.object({
        nom: Joi.string().min(3).max(40).required(),
    })
    return schema.validate(role);
}


exports.Role = Role;
exports.validate = validateRole