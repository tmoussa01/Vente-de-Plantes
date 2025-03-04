import axios from 'axios';
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;

const state = {
    listRole: [],
    non: ''
}

const getters = {
    TousLesRoles: (state) => state.listRole,
}

const actions = {
    async GetRoles({ commit }) {
        axios.get(`${URL_backend}/role/RoleByPage/${1}`)
            .then(res => {
                commit('setRole', res.data)
            })
    },

    async GetRoleByID({ commit }, ID) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;
        axios.get(`${URL_backend}/role/${ID}`,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('non');
                return res.data;
            })
    },





}

const mutations = {
    setRole:
        (state, role) => (state.listRole = role),

    non:
        (state) => (state.non = '')
}





export default {
    state,
    getters,
    actions,
    mutations
}



