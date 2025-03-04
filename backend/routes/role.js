const { Role } = require('../models/role');
// const authentification = require('../middleware/authentification')
// const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();



router.get('/All', async (req, res) => {
    const role = await Role.find();
    res.send(role)
})
router.get('/:id', async (req, res) => {
    console.log("role id", req.params.id)
    const role = await Role.findById(req.params.id);

    if (!role) return res.status(404).send('le role avec l id indiqué n a pas été retrouvée.');

    res.send(role);
})

router.get('/RoleByPage/:Page', async (req, res) => {
    const pageNumber = req.params.Page;
    const pageSize = 2;//nbr d'elelment dans la page
    const role = await Role
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    console.log("role", role)

    res.send(role)

})


module.exports = router;