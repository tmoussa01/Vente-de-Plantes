const { ML_Result } = require('../models/machineLearning/ml_result');
const authentification = require('../middleware/authentification')
const express = require('express');

const router = express.Router();




router.get('/All', authentification, async (req, res) => {
    let userID = req.user._id;
    let BigData = [];

    const MLres = await ML_Result.find({
        UserID_ML_Result: userID
    })
        .populate('Selected_ML_Result')
        .select(['-_id', '-UserID_ML_Result'])
    console.log("MLres", MLres)
    for (let index = 0; index < MLres.length; index++) {
        const element = MLres[index];

        let ifdata = BigData.find(x => x._id === element['Selected_ML_Result']._id);
        if (!ifdata) {
            BigData.push(element['Selected_ML_Result']);
        }
    }
    console.log('BigData', BigData)
    res.send(BigData);
})

module.exports = router;