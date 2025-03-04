import axios from 'axios';
const port = process.env.PORT || 5000;
const URL_backend = `http://localhost:${port}/api`;
const state = {
    mouvementUtilisateur: {
        Recherche: [],
        Panier: [],
        Elements: []
    }
};
const getters = {
    TouslesMouvementUtilisateur: (state) => state.mouvementUtilisateur,
}

const actions = {
    async SetUserRechercheMouvement({ commit }, data) {

        let token = JSON.parse(localStorage.getItem('Authentification')).Token;
        if (token) {
            let planteID = data[0]._id
            axios.patch(`${URL_backend}/machine_learning/${planteID}`, {},
                { headers: { 'x-auth-token': token } })
                .then(res => {
                    console.log('result', res.data),
                        commit('SetUserRechercheMouvements', '')
                })
        }

    },
    async SetUserPanierMouvement({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;
        if (token) {
            axios.patch(`${URL_backend}/machine_learning/${data}`,
                {},
                { headers: { 'x-auth-token': token } })
                .then(res => {
                    console.log('result', res.data),
                        commit('SetUserPanierMouvements', data)
                })
        }
    },

}

const mutations = {

    SetUserRechercheMouvements: (state, mouvrecherche) =>
        (state.mouvementUtilisateur.Recherche.unshift(mouvrecherche)),

    SetUserPanierMouvements: (state, mouvpanier) => (state.mouvementUtilisateur.Panier = mouvpanier),


}


export default {
    state,
    getters,
    actions,
    mutations
}