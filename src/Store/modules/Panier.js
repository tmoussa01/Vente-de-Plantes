
const state = {
    listeDataPanier: []
    ,
    non: ''
}

const getters = {
    TousLesElemPanier: (state) => state.listeDataPanier
}

const actions = {
    async GetElemPanier({ commit }) {
        if (localStorage.getItem("Panier")) {
            const localStoragePanier = JSON.parse(localStorage.getItem("Panier"));
            commit('SetNew', localStoragePanier)
        } else {
            let tableVide = [];
            const localStoragePanier = localStorage.setItem("Panier", JSON.stringify(tableVide));
            commit('SetNew', localStoragePanier)
        }

    },
    async SupprimerElemDuPanier({ commit }, ID) {
        if (localStorage.getItem("Panier")) {
            let panierData = JSON.parse(localStorage.getItem("Panier"));
            let elemData = panierData.findIndex((obj => obj.id == ID));
            if (elemData !== -1) {
                panierData = panierData.filter(x => { return x.id !== ID })
                localStorage.setItem("Panier", JSON.stringify(panierData));
                commit('SetNew', panierData);
            }
        }
    },
    async DansPanier({ commit }, ID) {
        if (localStorage.getItem("Panier")) {
            let panierData = JSON.parse(localStorage.getItem("Panier"));
            let ItemDATA = panierData.findIndex((obj => obj.id == ID));

            let dansPanier;

            if (ItemDATA !== -1) {
                dansPanier = true;
            }
            if (ItemDATA == -1) {
                dansPanier = false;
            }
            commit('non');
            return dansPanier;

        }
    },

    async SetNewElemPanier({ commit }, ID) {
        let quantiteParDefaut = 1;

        if (localStorage.getItem("Panier")) {
            let nouveauElement = { id: ID, quantite: quantiteParDefaut }
            let panierData = JSON.parse(localStorage.getItem("Panier"));
            let elemData = panierData.findIndex((obj => obj.id == ID));

            if (elemData !== -1) {
                let objIndex = panierData.findIndex((obj => obj.id == ID));
                panierData[objIndex].quantite++;
                localStorage.setItem("Panier", JSON.stringify(panierData))
            } else {
                panierData.push(nouveauElement)
                localStorage.setItem("Panier", JSON.stringify(panierData))
            }
            commit('SetNew', panierData);
        } else {
            let listeNouveauElementData = [{ id: ID, quantite: quantiteParDefaut }];
            localStorage.setItem("Panier", JSON.stringify(listeNouveauElementData));
            commit('SetNew', listeNouveauElementData)
        }

    },
    async ChangeQuantiteElem({ commit }, data) {
        if (localStorage.getItem("Panier")) {
            let dataPanier = JSON.parse(localStorage.getItem("Panier"));
            let dataElem = dataPanier.findIndex((obj => obj.id == data.id));
            if (dataElem !== -1) {
                let objIndex = dataPanier.findIndex((obj => obj.id == data.id));
                dataPanier[objIndex].quantite = data.quantite;
                localStorage.setItem("Panier", JSON.stringify(dataPanier));
                commit('SetNew', dataPanier);
            }
        }
    },
}

const mutations = {
    SetNew:
        (state, elementsPanier) => (state.listeDataPanier = elementsPanier),
    non:
        (state) => (state.non = '')
}


export default {
    state,
    getters,
    actions,
    mutations
}