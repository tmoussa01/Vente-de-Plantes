
import { createRouter, createWebHistory } from 'vue-router';
import Principale from './components/home/principale.vue';
import PlanteDescription from './components/planteDescription/planteDescription.vue';
import Panier from './components/panier/panier.vue';
import ConnexionInscription from './components/connexionInscription/connexionInscription.vue';
import Inscription from './components/connexionInscription/inscription.vue';
import Verification from './components/connexionInscription/verification.vue';
import ResetPassword from './components/connexionInscription/resetPasswordForm.vue';
import Profile from './components/profile/profile.vue';
import WishList from './components/wishList/wishList.vue';
import Recherche from './components/recherche/recherche.vue';
import PageCheckout from './components/achat/pageCheckout.vue';
import SuccessPayement from './components/achat/succesPayement.vue';
import Admin from './components/admin/admin.vue';
import AdminPRO from './routeProtection/adminProtection';
import AuthPRO from './routeProtection/authentificationProtection';
import ConnexionInscPRO from './routeProtection/connexionInscriptionProtection';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'PrincipalePage',
            path: '/',
            component: Principale,
        },
        {
            name: 'PlanteDescription',
            path: '/PlanteDescription',
            component: PlanteDescription,
        },
        {
            name: 'PanierPage',
            path: '/Panier',
            component: Panier
        },
        {
            name: 'ConnexionInscription',
            path: '/ConnexionInscription',
            component: ConnexionInscription,
            beforeEnter: (to, from, next) => {
                ConnexionInscPRO(to, from, next);
            }
        },
        {
            name: 'Inscription',
            path: '/Inscription',
            component: Inscription,
            beforeEnter: (to, from, next) => {
                ConnexionInscPRO(to, from, next);
            }
        }, {
            name: 'Verification',
            path: '/verification',
            component: Verification,
            beforeEnter: (to, from, next) => {
                ConnexionInscPRO(to, from, next);
            }
        }, {
            name: 'resetPassword',
            path: '/resetPassword',
            component: ResetPassword,
            beforeEnter: (to, from, next) => {
                ConnexionInscPRO(to, from, next);
            }
        },
        {
            name: 'ProfilePage',
            path: '/ProfilePage',
            component: Profile,
            beforeEnter: (to, from, next) => {
                AuthPRO(to, from, next);
            }
        },
        {
            name: 'WishListPage',
            path: '/WishList',
            component: WishList,
            beforeEnter: (to, from, next) => {
                AuthPRO(to, from, next);
            }
        },
        {
            name: 'PageCheckout',
            path: '/PageCheckout',
            component: PageCheckout,
            beforeEnter: (to, from, next) => {
                AuthPRO(to, from, next);
            }
        }, {
            name: 'SuccessPayment',
            path: '/success-payment',
            component: SuccessPayement,
            beforeEnter: (to, from, next) => {
                AuthPRO(to, from, next);
            }
        },
        {
            name: 'RecherchePage',
            path: '/RecherchePage',
            component: Recherche
        },
        {
            path: '/Admin',
            name: 'Admin',
            component: Admin,
            beforeEnter: (to, from, next) => {
                AdminPRO(to, from, next);
            }
        }
    ]
});

export default router;
