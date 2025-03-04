const state = {
    authentification: { connection: false, role: null, Token: null }
};

const getters = {
    UserAuthentification: (state) => state.authentification,

}

const actions = {
    async getUserAuthentication({ commit }) {
        try {
            if (localStorage.getItem("Authentification")) {
                const authData = JSON.parse(localStorage.getItem('Authentification'));
                commit('SetAndGetUserAuthStatus', authData);
            }
            else {
                const newStatus = { connection: false, role: null, Token: null };
                localStorage.setItem("Authentification", JSON.stringify(newStatus));
                commit('SetAndGetUserAuthStatus', newStatus);
            }
        } catch (error) {
            console.error('erreur récupération de l authentification:', error);
        }
    },
    async setUserAuthentication({ commit }, data) {
        try {
            const newStatus = { connection: data.connection, role: data.role, Token: data.Token };
            localStorage.setItem("Authentification", JSON.stringify(newStatus));
            commit('SetAndGetUserAuthStatus', newStatus);
        } catch (error) {
            console.error('erreur data authentification:', error);
        }
    }
}


const mutations = {
    SetAndGetUserAuthStatus:
        (state, UserAuthStatuts) => (
            state.authentification.connection = UserAuthStatuts.connection,
            state.authentification.role = UserAuthStatuts.role,
            state.authentification.Token = UserAuthStatuts.Token
        )
}




export default {
    state,
    getters,
    actions,
    mutations
}