import axios from 'axios';
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;

const state = {
    listFormat: [],
    non: ''
}

const getters = {

    toutesLesFormat: (state) => state.listFormat,
}

const actions = {
    async GetFormats({ commit }) {
        axios.get(`${URL_backend}/format/formByPage/${1}`)
            .then(res => {
                commit('setFormats', res.data)
            })
    },
    async GetFormNumPage({ commit }, PageNum) {
        axios.get(`${URL_backend}/format/formByPage/${PageNum}`)
            .then(res => {
                commit('setFormats', res.data)
            })
    },
    async GetFormByID({ commit }, ID) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;
        axios.get(`${URL_backend}/format/${ID}`,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('non');
                return res.data;
            })
    },
    async ajouterForm({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.post(`${URL_backend}/format`, {
            nom: data.NewCatNom
        }, { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('AjouterFormats', res.data);
            })
    },
    async modifierForm({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;

        axios.put(`${URL_backend}/format/${data.ID}`, {
            nom: data.nom
        }, { headers: { 'x-auth-token': token } })
            .then(() => {
                let objIndex = state.listFormat
                    .findIndex((obj => obj._id == data.ID));
                let nom = data.nom;
                let NewDatObj = { objIndex, nom };
                commit('ModifierFormats', NewDatObj)
            })
            .catch((err) => {
                console.log(err.response.data.msg)
            })
    },
    async supprimerFormat({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;


        axios.delete(`${URL_backend}/format/${data.ID}`,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                console.log('deleted format successfully', res.data);

                let nvListe =
                    state.listFormat.filter(x => { return x._id != data.ID });
                commit('SupprimerFormat', nvListe);
            })
            .catch((err) => {
                console.log(err.response.data.msg)

            })
    }


}

const mutations = {
    setFormats:
        (state, formats) => (state.listFormat = formats),
    AjouterFormats:
        (state, NewData) => (state.listFormat.unshift(NewData)),
    ModifierFormats:
        (state, NewData) => (state.listFormat[NewData.objIndex].nom = NewData.nom),
    SupprimerFormat:
        (state, NewData) => (state.listFormat = NewData),
    non:
        (state) => (state.non = '')
}





export default {
    state,
    getters,
    actions,
    mutations
}



