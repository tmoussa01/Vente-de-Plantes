import axios from 'axios';
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
const state = {
    WishList: [],

    non: ''
};

const getters = {

    tousWistList: (state) => state.WishList,
};

const actions = {

    async getWishList({ commit }) {
        console.log('dans getWishList');
        try {
            let token = JSON.parse(localStorage.getItem('Authentification')).Token;
            const response = await axios.get(`${URL_backend}/wishList/WishListByPage/${1}`, { headers: { 'x-auth-token': token } });
            commit('setWishList', response.data);

            return response.data;
        } catch (error) {
            console.error("erreur lors de la récupération de la liste de souhaits : ", error);
            throw error;
        }
    },

    async GetWishListByID({ commit }, ID) {
        try {
            let token = JSON.parse(localStorage.getItem('Authentification')).Token;
            const response = await axios.get(`${URL_backend}/wishList/${ID}`, { headers: { 'x-auth-token': token } });

            commit('non');

            return response.data;
        } catch (error) {
            console.error("erreur lors de la récupération de la liste de souhaits : ", error);
            throw error;
        }
    },

    async GetWishListByNumPage({ commit }, numPage) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;
        axios.get(`${URL_backend}/wishList/wishListByPage/${numPage}`, { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('SetWishByNumPage', res.data);
            })
    },
    async ajouterDansWishList({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token;
        axios.post(`${URL_backend}/wishList`, data,
            { headers: { 'x-auth-token': token } })
            .then(res => {
                commit('NewWish', res.data);

            })
            .catch((err) => {
                alert(err.response.data)
            })
    },

    async DeleteWish({ commit }, data) {
        let token = JSON.parse(localStorage.getItem('Authentification')).Token

        axios.delete(`${URL_backend}/wishList/${data}`,
            { headers: { 'x-auth-token': token } })
            .then((res) => {
                console.log('deleted prod success', res.data);
                let newArrDataDel = state.WishList.filter(x => { return x.id != data.ID })
                commit('DeleteWish', newArrDataDel);
            })
    }


};

const mutations = {

    setWishList:
        (state, nouveauDataWish) => (state.WishList = nouveauDataWish),

    NewWish: (state, newwish) => state.WishList.unshift(newwish),



    DeleteWish: (state, newArrDel) => (state.WishList = newArrDel),

    SetWishByNumPage:
        (state, nouveauDataWishArr) => (state.WishList = nouveauDataWishArr),

    non:
        (state) => (state.non = '')
};

export default {
    state,
    getters,
    actions,
    mutations
}


