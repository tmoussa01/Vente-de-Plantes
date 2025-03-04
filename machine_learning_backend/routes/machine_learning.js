const { ML_Result } = require('../models/machineLearning/ml_result');
const { Plantes } = require('../models/plantes')

const authentification = require('../middleware/authentification')
const brain = require('brain.js');
const express = require('express');

const router = express.Router();




router.patch('/:PlanteID', authentification, async (req, res) => {


    let userID = req.user._id;
    let idPlante = req.params.PlanteID;

    const planteChoisi = await Plantes.findById(idPlante)

    let plante_meme_categorie = await Plantes
        .find({ plante_categories: planteChoisi.plante_categories }) // on récupère tous les plante qui on la même catègorie que notre plante
        .select('-plante_categories');



    const data_entrainement = [];

    for (let prodID in plante_meme_categorie) { // on recupère uniquement le nom et la description de la plante (des plante qui on la même catégorie que la plante choisi)

        const data = plante_meme_categorie[prodID];
        if (String(plante_meme_categorie[prodID]._id) !== String(planteChoisi._id)) {
            data_entrainement.push({
                input: [data.nom, data.description], // entré
                output: String(data.nom) //sorti
            });
        }
    }


    console.log('tr', data_entrainement)




    let resFinal = [];
    let element = data_entrainement;

    for (let index = 0; index < data_entrainement.length; index++) {
        /* on démarre l'entarinement ici, 
               on crée une nouvelle instance du modèle LSTM(c'est une classe de la bibliothèque Brain.js)
               c'est un type de réseau neuronale récurrents(conçu pour gérer séquences de données) ( très bon pour travailler avec du texte)
               on va commencé l'entrainement en lui donnant element qui dispose de paires d'entré et de sorti (voir au dessus).
               on demande de faire 100 itérations (c'est là qu'il fera au fur et à mesure ses réglages pour réduire le taux d'erreur)
               lorsque le taux d'erreur (errorThresh) est inférieur à 0.0011 on arrêt l'entrainement.
               
               */
        const net = new brain.recurrent.LSTM();
        net.train(element, {
            iterations: 100,
            errorThresh: 0.0011,
        });

        const result = net // on utilise le modèle pour faire une prédiction.on lui doone les donnée ProducSelected en entré
            .run([planteChoisi.nom, planteChoisi.description]);
        if (result !== '') {
            resFinal.push(result); // on rentre dans la condition si on trouve un résultat (on à une prédiction)
            console.log('result', result)
        }
        element = element.filter(function (item) { // pour éviter d'avoir la même prédiction on fait un nettoyage dans element(notre donné d'entrainement)  on supprime les entré qui nous on permis d'obtenir la prédiction
            return item.output !== result
        })


        if (resFinal.length == 3) {  // on continue les prédictions jusqu'à se qu'on obtient 3 résultats ou dès qu'on à fait tous les 100 itérations
            console.log('last', resFinal)

            let resFinalPrixSimilaire = [];
            let nvListePlante = [];

            const needle = planteChoisi.prix;

            for (let index = 0; index < resFinal.length; index++) {
                let res = resFinal[index];

                let object = await Plantes    // on va chercher la première plante dont le nom correspond au texte res et on l'
                    .find({ $text: { $search: res } })
                    .limit(1)
                console.log('object', object)
                nvListePlante.push(object)

                if (index < resFinal.length) { //maintenant on va chercher les plantes qui on un prix proche de notre plante envoyée
                    console.log('nvListePlante', nvListePlante)

                    for (let index = 0; index < nvListePlante.length; index++) {

                        const plante_prix_proche = nvListePlante.reduce((a, b) => { // ici on va enregistrer la plante avec le prix le plus proche de la plante envoyée ( la comparaison ce fait avec reduce)
                            return Math.abs(b - needle) < Math.abs(a - needle) ? b : a;
                        });
                        console.log('plante_prix_proche', plante_prix_proche);


                        nvListePlante = nvListePlante.filter(function (item) { // on retire notre résulatat(plante avec le prix le plus proche de notre liste pour pas le reconsodére une nouvelle fois)
                            return item !== plante_prix_proche
                        })

                        resFinalPrixSimilaire.push(plante_prix_proche);

                        if (resFinalPrixSimilaire.length < 3 && object && object.length > 0 && object[0]._id) {//on vérifie qu'on a moins de 3 résultats et que ces résultats existe (non null) et dispose d'un _id(existe dans DB) 
                            console.log('machineL', object[0])
                            let dansDb = await ML_Result.findOne({
                                Selected_ML_Result: object[0]._id,
                                UserID_ML_Result: userID
                            })
                            console.log("dansDb", dansDb)
                            if (dansDb === null) {
                                console.log("enregistré dans DB ml_result")
                                let machineL = new ML_Result({
                                    Selected_ML_Result: object[0]._id,
                                    UserID_ML_Result: userID
                                });
                                machineL = await machineL.save();
                            }


                        }


                        if (resFinalPrixSimilaire.length == 2) { // si on dispose de 2 résultat alors on arrete la boucle
                            console.log('Final Result x', resFinalPrixSimilaire)
                            break;
                        }

                    }
                }
            }

            break;
        }

    }

    res.send({ data: 'done' });

})


module.exports = router;