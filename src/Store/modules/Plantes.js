import axios from 'axios';
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
const state = {
    ListePlante: [],

    non: ''
};

const getters = {

    tousLesPlantes: (state) => state.ListePlante,
};

const actions = {
    async getPlantes({ commit }) {
        axios.get(`${URL_backend}/plantes/PlanteByPage/${1}`)
            .then(res => {
                commit('setPlantes', res.data)
            })
    },
    async GetPlanteByID({ commit }, ID) {
        axios.get(`${URL_backend}/plantes/${ID}`)
            .then(res => {
                commit('non');
                return res.data;
            })
    },
    async GetPlanteByNumPage({ commit }, numPage) {
        axios.get(`${URL_backend}/plantes/PlanteByPage/${numPage}`)
            .then(res => {
                commit('SetPlanteByNumPage', res.data);
            })
    },
    async ajouterPlante({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.post(`${URL_backend}/plantes`, data,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('NewPlantes', res.data);
            })
            .catch((err) => {
                alert(err.response.data)
            })
    },
    async modifierPlante({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.put(`${URL_backend}/plantes/${data._id}`, data,
            { headers: { 'x-auth-token': token } })
            .then(() => {
                let objIndex = state.ListePlante
                    .findIndex((obj => obj._id == data._id));
                let nom = data.nom;
                let plante_categories = data.plante_categories;
                let description = data.description;
                let prix = data.prix;
                let plante_img = data.plante_img;
                let NewDatObj = { objIndex, nom, plante_categories, description, prix, plante_img }

                commit('EditOnePlantes', NewDatObj);
            })

    },
    async DeletePlant({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.delete(`${URL_backend}/plantes/${data._id}`, data,
            { headers: { 'x-auth-token': token } })
            .then((res) => {
                console.log('deleted prod success', res.data);
                let newArrDataDel = state.ListePlante.filter(x => { return x.id != data.ID })
                commit('DeletePlante', newArrDataDel);
            })
    }


};

const mutations = {

    setPlantes:
        (state, nouveauDataPlante) => (state.ListePlante = nouveauDataPlante),

    NewPlantes: (state, newprod) => state.ListePlante.unshift(newprod),

    EditOnePlantes: (state, NewDatObj) => (state.ListePlante[NewDatObj.objIndex].nom = NewDatObj.nom,
        state.ListePlante[NewDatObj.objIndex].plante_categories = NewDatObj.plante_categories,
        state.ListePlante[NewDatObj.objIndex].description = NewDatObj.description,
        state.ListePlante[NewDatObj.objIndex].prix = NewDatObj.prix,
        state.ListePlante[NewDatObj.objIndex].plante_img = NewDatObj.plante_img),

    DeletePlante: (state, newArrDel) => (state.ListePlante = newArrDel),

    SetPlanteByNumPage:
        (state, nouveauDataPlanteArr) => (state.ListePlante = nouveauDataPlanteArr),

    non:
        (state) => (state.non = '')
};

export default {
    state,
    getters,
    actions,
    mutations
}


