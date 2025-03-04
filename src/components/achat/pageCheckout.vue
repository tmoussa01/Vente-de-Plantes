<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Bloc d'informations utilisateur -->
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-header">Informations Utilisateur</div>
          <div class="card-body">
            <div class="form-group">
              <label for="nom">Nom :</label>
              <input
                type="text"
                class="form-control"
                id="nom"
                v-model="dataUtilisateur.nom"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="prenom">Prénom :</label>
              <input
                type="text"
                class="form-control"
                id="prenom"
                v-model="dataUtilisateur.prenom"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="email">Email :</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="dataUtilisateur.email"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Bloc d'informations sur l'adresse -->
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-header">Adresse de Livraison</div>
          <div class="card-body">
            <div class="form-group">
              <label for="rue">Numéro de téléphone :</label>
              <input
                type="text"
                class="form-control"
                id="rue"
                v-model="livraison.telephone"
                required
                :class="{ 'is-invalid': !validationTel }"
              />
              <div class="invalid-feedback">
                Veuillez entrer un numéro de téléphone valide.
              </div>
            </div>
            <div class="form-group">
              <label for="rue">Rue :</label>
              <input
                type="text"
                class="form-control"
                id="rue"
                v-model="livraison.rue"
                required
                :class="{ 'is-invalid': !validationRue }"
              />
              <div class="invalid-feedback">
                Veuillez entrer une rue valide (entre 3 et 40 charactères).
              </div>
            </div>
            <div class="form-group">
              <label for="numero">Numéro :</label>
              <input
                type="text"
                class="form-control"
                id="numero"
                v-model="livraison.numero"
                required
                :class="{ 'is-invalid': !validationNumero }"
              />
              <div class="invalid-feedback">
                Veuillez entrer un numéro de domicile valide.
              </div>
            </div>
            <div class="form-group">
              <label for="codePostal">Code Postal :</label>
              <input
                type="text"
                class="form-control"
                id="codePostal"
                v-model="livraison.codePostal"
                required
                :class="{ 'is-invalid': !validationPostal }"
              />
              <div class="invalid-feedback">
                Veuillez entrer un code postal valide.
              </div>
            </div>
            <div class="form-group">
              <label for="pays">Pays :</label>
              <input
                type="text"
                class="form-control"
                id="pays"
                v-model="livraison.pays"
                required
                :class="{ 'is-invalid': !validationPays }"
              />
              <div class="invalid-feedback">
                Veuillez entrer un pays valide.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bloc d'informations de la carte bancaire -->
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-header">Informations de la Carte Bancaire</div>
          <div class="card-body">
            <div class="form-group">
              <label for="nomCarte">Nom du Propriétaire :</label>
              <input
                type="text"
                class="form-control"
                id="nomCarte"
                v-model="carte.nomProprietaire"
                required
                :class="{ 'is-invalid': !validationNomProprio }"
              />
              <div class="invalid-feedback">Veuillez entrer un nom valide.</div>
            </div>
            <div class="form-group">
              <label for="numeroCarte">Numéro de Carte :</label>
              <input
                type="text"
                class="form-control"
                id="numeroCarte"
                v-model="carte.numero"
                required
                :class="{ 'is-invalid': !validationNumCarte }"
              />
              <div class="invalid-feedback">
                Veuillez entrer un numéro de carte valide.(16 chiffres)
              </div>
            </div>
            <div class="form-group">
              <label for="dateExpiration">Date d'Expiration :</label>
              <input
                type="date"
                class="form-control"
                id="dateExpiration"
                v-model="carte.dateExpiration"
                required
                :class="{ 'is-invalid': !validationDate }"
              />
              <div class="invalid-feedback">
                La validation de votre carte ne doit pas être expirée.
              </div>
            </div>
            <!-- Intégrer Stripe pour le paiement -->
            <div id="stripe-element">
              <!-- Intégration Stripe ici -->
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé des produits sélectionnés -->
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-header">Résumé des Produits Sélectionnés</div>
          <div class="card-body">
            <!-- Liste des produits ici -->
            <div class="col-3" v-for="elem in elements" :key="elem._id">
              <div class="card mb-4">
                <img
                  :src="elem.plante_img"
                  class="card-img-top"
                  style="max-width: 14rem; max-height: 14rem"
                  alt="Image Not Found"
                />
                <div class="card-body">
                  <a :href="`/elem/${elem._id}`">{{ elem.nom }}</a>
                  <p class="mt-2">prix: {{ elem.prix }} €</p>
                  <p>Quantité: {{ elem.quantitePanier }}</p>
                  <p class="mt-2">
                    Coût: {{ elem.prix * elem.quantitePanier }} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bloc du total à payer -->
      <div class="col-lg-4" v-if="totalPlante != 0">
        <div class="card mb-4">
          <div class="card-header">Total à Payer</div>
          <div class="card-body">
            <h4>Total des articles : {{ totalPlante }} €</h4>
            <h4>Frais de livraison : {{ prixEnvoi }} €</h4>
            <hr />
            <h4>Total à Payer : {{ total }} €</h4>
            <!-- Bouton pour confirmer le paiement -->
            <button
              class="btn btn-success btn-block"
              type="submit"
              @click="confirmerPaiement"
            >
              Payer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
require("dotenv").config({ path: "./.env" });
const stripeInit = loadStripe(process.env.STRIPE_PUBLIC);
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
import { mapActions, mapGetters } from "vuex";
export default {
  name: "CheckoutPage",
  data() {
    return {
      total: 0,
      totalPlante: 0,
      prixEnvoi: 0,
      dataUtilisateur: {},

      livraison: {
        telephone: "",
        rue: "",
        numero: "",
        codePostal: "",
        pays: "",
      },
      formatNumber: /^[0-9+-]+$/,
      carte: {
        nomProprietaire: "",
        numero: "",
        dateExpiration: "",
      },
      totalAPayer: 0, // Mettez à jour le total ici
      elements: [],
    };
  },
  created() {
    this.getPlanteDansPanier();
    const token = JSON.parse(localStorage.getItem("Authentification")).Token;
    axios
      .get(`${URL_backend}/utilisateurs/me`, {
        headers: { "x-auth-token": token },
      })
      .then((res) => {
        let nvList = {
          userID: res.data._id,
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
        };
        this.dataUtilisateur = nvList;
      })
      .catch((err) => {
        console.log("err", err.response.data.msg);
      });
  },
  computed: {
    ...mapGetters(["TousLesElemPanier"]),
    // adresse livraison
    validationTel() {
      if (this.livraison.telephone == null) return null;
      else if (
        this.livraison.telephone.length >= 9 &&
        this.livraison.telephone.length <= 20 &&
        this.formatNumber.test(this.livraison.telephone)
      )
        return true;
      else return false;
    },
    validationRue() {
      if (this.livraison.rue == null) return null;
      else if (this.livraison.rue.length == 0 || this.livraison.rue.length < 3)
        return false;
      else return true;
    },
    validationNumero() {
      if (this.livraison.numero == null) return null;
      else if (this.livraison.numero == 0) return false;
      else return true;
    },
    validationPostal() {
      if (this.livraison.codePostal == null) return null;
      else if (this.livraison.codePostal == 0) return false;
      else return true;
    },
    validationPays() {
      if (this.livraison.pays == null) return null;
      else if (this.livraison.pays == 0) return false;
      else return true;
    },

    // carte bancaire

    validationNomProprio() {
      if (this.carte.nomProprietaire == null) return null;
      else if (
        this.carte.nomProprietaire == 0 ||
        this.carte.nomProprietaire.length < 3
      )
        return false;
      else return true;
    },
    validationNumCarte() {
      if (this.carte.numero == null) return null;
      else if (this.carte.numero == 0 || this.carte.numero.length < 16)
        return false;
      else return true;
    },
    validationDate() {
      const dateExpiration = new Date(this.carte.dateExpiration);
      const dateActuelle = new Date();

      if (dateActuelle > dateExpiration) {
        return false;
      } else return true;
    },

    totalNumberOfItemsInCart() {
      return this.elements.reduce(
        (total, elem) => total + elem.quantitePanier,
        0
      );
    },
    fraisLivraison() {
      const numberOfItems = this.totalNumberOfItemsInCart;

      if (this.totalAPayer >= 100) {
        return this.prixEnvoi == 0; // Livraison gratuite
      }

      // Si le total des articles est entre 1 et 5, les frais de livraison sont de 5 euros
      if (numberOfItems >= 1 && numberOfItems <= 5) {
        return this.prixEnvoi == 5;
      }

      // Pour chaque tranche de 5 articles supplémentaires, ajoutez 2 euros de frais de livraison
      const additionalItems = numberOfItems - 5;
      const additionalShippingCost = Math.ceil(additionalItems / 5) * 2;

      // Les frais de livraison totaux sont les frais de base (5 euros) plus les frais supplémentaires
      return this.prixEnvoi == 5 + additionalShippingCost;
    },
  },
  watch: {
    elements() {
      this.prixTotal();
    },
  },

  methods: {
    ...mapActions(["GetElemPanier"]),
    getPlanteDansPanier() {
      this.GetElemPanier();
      let list = this.TousLesElemPanier;
      let promises = [];

      for (let i = 0; i < list.length; i++) {
        const data = list[i];
        let promise = axios
          .get(`${URL_backend}/plantes/${data.id}`)
          .then((res) => {
            let plante = this.TousLesElemPanier.findIndex(
              (obj) => obj.id == res.data._id
            );
            let quantite = this.TousLesElemPanier[plante].quantite;
            res.data.quantitePanier = quantite;
            return res.data;
          });
        promises.push(promise);
      }

      Promise.all(promises)
        .then((result) => {
          this.elements = result;
        })
        .catch((error) => {
          console.error("Une erreur s'est produite : ", error);
        });
    },
    prixTotal() {
      let quantite = this.elements.reduce(
        (total, elem) => total + elem.quantitePanier,
        0
      );
      const numberOfItems = quantite;
      console.log("quantite", numberOfItems);

      const dataListe = [];

      for (let index = 0; index < this.elements.length; index++) {
        let total =
          parseInt(this.elements[index].prix) *
          parseInt(this.elements[index].quantitePanier);
        dataListe.push(parseInt(total));
      }
      let resultat = dataListe.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.totalPlante = resultat;
      if (this.totalPlante >= 100) {
        console.log("ici");
        this.prixEnvoi = 0; // Livraison gratuite
      }

      // Si le total des articles est entre 1 et 5, les frais de livraison sont de 5 euros
      if (numberOfItems >= 1 && numberOfItems <= 5) {
        this.prixEnvoi = 5;
      }

      // Pour chaque tranche de 5 articles supplémentaires, ajoutez 2 euros de frais de livraison
      const additionalItems = numberOfItems - 5;
      const additionalShippingCost = Math.ceil(additionalItems / 5) * 2;

      // Les frais de livraison totaux sont les frais de base (5 euros) plus les frais supplémentaires
      this.prixEnvoi = 5 + additionalShippingCost;

      this.total = this.totalPlante + this.prixEnvoi;
    },

    async confirmerPaiement() {
      let checkoutItems = [];
      for (let i = 0; i < this.elements.length; i++) {
        let obj = {
          price_data: {
            unit_amount: this.elements[i].prix * 100,
            currency: "EUR",
            product_data: {
              name: this.elements[i]._id,
            },
          },
          quantity: this.elements[i].quantitePanier,
        };
        checkoutItems.push(obj);
      }
      checkoutItems.push({
        price_data: {
          unit_amount: this.prixEnvoi * 100,
          currency: "EUR",
          product_data: {
            name: "Shipping Cost",
          },
        },
        quantity: 1,
      });
      try {
        await axios
          .post(`${URL_backend}/commande/checkoutSession`, {
            checkoutProduct: checkoutItems,
            customerName: this.dataUtilisateur.nom,
            customerEmail: this.dataUtilisateur.email,
            customerPhoneNo: this.livraison.telephone,
            shippingAddress: this.livraison,
            carte: this.carte,
          })
          .then((res) => {
            stripeInit.then((stripe) => {
              stripe
                .redirectToCheckout({
                  sessionId: res.data,
                })
                .catch(function (error) {
                  console.error(error);
                });
            });
          });
      } catch (error) {
        console.log(error.response.data.error);
      }
    },
  },
};
</script>

<style scoped>
/* Styles personnalisés ici */
</style>
