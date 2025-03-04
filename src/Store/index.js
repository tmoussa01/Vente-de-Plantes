
import { createStore } from 'vuex'; // Importer createStore au lieu de Vuex
import Plantes from './modules/Plantes';
import Categories from './modules/Categories';
import Format from './modules/Format';
import Panier from './modules/Panier';
import Authentification from './modules/Authentification';
import MouvementUtilisateur from './modules/MouvementUtilisateur';
import Utilisateur from './modules/Utilisateur';
import Role from './modules/role';
import WishList from './modules/wishList';

const store = createStore({ // Utiliser createStore pour créer le store
    modules: {
        Plantes,
        Categories,
        Panier,
        Authentification,
        MouvementUtilisateur,
        Utilisateur,
        Role,
        Format,
        WishList
    }
});

export default store;
