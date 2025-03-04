import axios from 'axios';
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
const state = {
    listeUtilisateur: []
}


const getters = {
    TousLesUtilisateurs: (state) => state.listeUtilisateur
}


const actions = {
    async GetUserList({ commit }) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;


        axios.get(`${URL_backend}/utilisateurs/${1}`,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('SetListUtilisateur', res.data);
            })
    },
    async GetUsByPNum({ commit }, PageNum) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;


        axios.get(`${URL_backend}/utilisateurs/${PageNum}`,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('SetListUtilisateur', res.data);
            })
    },
    async ModifUtilisateur({ commit }, data) {
        let Tok = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.put(`${URL_backend}/utilisateurs/Role`,
            { _id: data.id, role: data.role },
            { headers: { 'x-auth-token': Tok } })
            .then(() => {
                let objIndex = state.listeUtilisateur
                    .findIndex((obj) => obj._id == data.id);
                let role = data.role;
                let NewDatOBJ = { objIndex, role };
                commit('ModifUtilisateur', NewDatOBJ);
            })
    }
}


const mutations = {
    SetListUtilisateur:
        (state, data) => (state.listeUtilisateur = data),
    ModifUtilisateur:
        (state, newData) => (state.listeUtilisateur[newData.objIndex].role = newData.role)
}

export default {
    state,
    getters,
    actions,
    mutations
}
