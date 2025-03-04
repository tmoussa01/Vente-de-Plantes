import axios from 'axios';
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;

const state = {
    listCategorie: [],
    non: ''
}

const getters = {

    toutesLesCategorie: (state) => state.listCategorie,
}

const actions = {
    async GetCategories({ commit }) {
        axios.get(`${URL_backend}/categories/CatByPage/${1}`)
            .then(res => {
                commit('setCategories', res.data)
            })
    },
    async GetCatNumPage({ commit }, PageNum) {
        axios.get(`${URL_backend}/categories/CatByPage/${PageNum}`)
            .then(res => {
                commit('setCategories', res.data)
            })
    },
    async GetCatByID({ commit }, ID) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;
        axios.get(`${URL_backend}/categories/${ID}`,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('non');
                return res.data;
            })
    },
    async ajouterCat({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.post(`${URL_backend}/categories`, {
            nom: data.NewCatNom
        }, { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('AjouterCategories', res.data);
            })
    },
    async modifierCat({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.put(`${URL_backend}/categories/${data.ID}`, {
            nom: data.nom
        }, { headers: { 'x-auth-token': token } })
            .then(() => {
                let objIndex = state.listCategorie
                    .findIndex((obj => obj._id == data.ID));
                let nom = data.nom;
                let NewDatObj = { objIndex, nom };
                commit('ModifierCategories', NewDatObj)
            })
            .catch((err) => {
                console.log(err.response.data.msg)
            })
    },
    async supprimerCat({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;


        axios.delete(`${URL_backend}/categories/${data.ID}`,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                console.log('deleted cat successfully', res.data);

                let nvListe =
                    state.listCategorie.filter(x => { return x._id != data.ID });
                commit('SupprimerCategories', nvListe);
            })
            .catch((err) => {
                console.log(err.response.data.msg)

            })
    }


}

const mutations = {
    setCategories:
        (state, categories) => (state.listCategorie = categories),
    AjouterCategories:
        (state, NewData) => (state.listCategorie.unshift(NewData)),
    ModifierCategories:
        (state, NewData) => (state.listCategorie[NewData.objIndex].nom = NewData.nom),
    SupprimerCategories:
        (state, NewData) => (state.listCategorie = NewData),
    non:
        (state) => (state.non = '')
}





export default {
    state,
    getters,
    actions,
    mutations
}



