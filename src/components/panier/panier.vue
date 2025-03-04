<template>
  <div>
    <center>
      <div class="col-sm-12 col-md-9 col-md-offset-1" v-if="elements.length">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantité</th>
              <th class="text-center">Prix</th>
              <th class="text-center">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="elem in elements" :key="elem._id">
              <td class="col-sm-8 col-md-6">
                <div class="media">
                  <a class="thumbnail pull-left" href="#">
                    <img
                      :src="elem.plante_img"
                      class="media-object"
                      style="width: 72px; height: 72px"
                    />
                  </a>
                  <div class="media-body">
                    <h4 class="media-heading">
                      <a class="nom" @click="voireDetailsPlante(elem._id)">
                        {{ tailleNom(elem.nom) }}</a
                      >
                    </h4>
                    <span>Desription : </span>
                    <span class="text-primary">
                      <strong>
                        {{ tailleDescription(elem.description) }}
                      </strong>
                    </span>
                  </div>
                </div>
              </td>
              <td class="col-sm-2 col-md-2" style="text-align: center">
                <div class="input-group">
                  <span class="input-group-btn">
                    <button
                      class="btn btn-default"
                      @click="decrementQuantity(elem)"
                      :disabled="elem.quantitePanier <= 1"
                    >
                      <i class="fa fa-minus"></i>
                    </button>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    :value="elem.quantitePanier"
                    readonly
                  />
                  <span class="input-group-btn">
                    <button
                      class="btn btn-default"
                      @click="incrementQuantity(elem)"
                      :disabled="elem.quantitePanier >= elem.quantite"
                    >
                      <i class="fa fa-plus"></i>
                    </button>
                  </span>
                </div>
              </td>

              <td class="col-sm-1 col-md-1 text-center">
                <strong> {{ elem.prix }} €</strong>
              </td>
              <td class="col-sm-1 col-md-1 text-center">
                <strong>{{ elem.prix * elem.quantitePanier }} €</strong>
              </td>
              <td class="col-sm-1 col-md-1">
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="supprimerDuPanier(elem._id)"
                >
                  <span class="fa fa-trash"></span> Retirer
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <h3>prix Totale € (sans le coût d'envoie)</h3>
              </td>
              <td class="text-right">
                <h3>
                  <strong>{{ prixTotale }}</strong>
                </h3>
              </td>
            </tr>

            <tr v-if="auth && elements.length">
              <td>
                <button type="button" class="btn btn-default">
                  <span class="fa fa-shopping-cart"></span> Continuer les achats
                </button>
              </td>
              <td>
                <router-link to="/PageCheckout" class="btn btn-success">
                  Checkout <span class="fa fa-play"></span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="elements.length == 0">Votre panier est vide</div>
    </center>
  </div>
</template>


<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
import { mapActions, mapGetters } from "vuex";
export default {
  name: "PanierPage",
  data() {
    return {
      prixTotale: 0,
      elements: [],
      auth: false,
    };
  },

  computed: {
    ...mapGetters(["TousLesElemPanier", "UserAuthentification"]),
  },
  created() {
    this.getDataUtilisateur();
    this.getPlanteDansPanier();
    console.log("dans create", this.elements);
  },
  watch: {
    elements() {
      this.prixTotalePanier();
    },
  },
  methods: {
    ...mapActions([
      "GetElemPanier",
      "ChangeQuantiteElem",
      "SupprimerElemDuPanier",
      "GetPlanteByID",
      "SetUserPanierMouvement",
      "getUserAuthentication",
    ]),
    tailleNom(value) {
      if (value.split(" ")[1]) {
        return value.split(" ")[0] + " " + value.split(" ")[1];
      } else {
        return value.split(" ")[0];
      }
    },
    tailleDescription(value) {
      return (
        value.split(" ")[0] +
        " " +
        value.split(" ")[1] +
        " " +
        value.split(" ")[2] +
        "...."
      );
    },
    getDataUtilisateur() {
      this.getUserAuthentication();
      this.auth = this.UserAuthentification.connection;
    },

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

    verifNvQuantite(elemId, event) {
      if (event.target.value == 0) {
        // si quantite egale zero changer en 1
        let newData = this.elements.map((elem) => {
          if (elem._id == elemId)
            return Object.assign({}, elem, { quantite: 1 });
          return elem;
        });
        this.elements = newData;
        console.log("verifnvQ", this.elements);
      } else {
        let newData = this.elements.map((elem) => {
          if (elem._id == elemId)
            return Object.assign({}, elem, { quantite: event.target.value });
          return elem;
        });

        let newDataLocalStorage = {
          id: elemId,
          quantite: Number(event.target.value),
        };

        this.ChangeQuantiteElem(newDataLocalStorage);

        this.elements = newData;
        console.log("verifnvq", this.elements);
      }
    },
    supprimerDuPanier(idElem) {
      let nouveauElements = this.elements.filter((x) => {
        return x._id != idElem;
      });
      this.elements = nouveauElements;
      console.log("supprimerDuPanier", this.elements);

      this.SupprimerElemDuPanier(idElem);
      this.ajouterPourUserMovements(idElem);
    },
    voireDetailsPlante(idElem) {
      this.$router
        .push({
          path: "/PlanteDescription",
          name: "PlanteDescription",
          query: {
            ID: idElem,
          },
        })
        .catch(() => {});
    },
    prixTotalePanier() {
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
      this.prixTotale = resultat;
    },
    ajouterPourUserMovements(id) {
      console.log("ajouterPourUserMovements");
      this.SetUserPanierMouvement(id);
    },

    // ...

    incrementQuantity(elem) {
      if (elem.quantitePanier < elem.quantite) {
        elem.quantitePanier++;
        this.updateQuantity(elem);
      }
    },

    decrementQuantity(elem) {
      if (elem.quantitePanier > 1) {
        elem.quantitePanier--;
        this.updateQuantity(elem);
      }
    },

    updateQuantity(elem) {
      if (elem.quantitePanier == 0) {
        let newData = this.elements.map((elemt) => {
          if (elemt._id == elem._id)
            return Object.assign({}, elemt, { quantitePanier: 1 });
          return elemt;
        });
        this.elements = newData;
      } else {
        let newData = this.elements.map((elemt) => {
          if (elemt._id == elem._id)
            return Object.assign({}, elemt, {
              quantitePanier: elem.quantitePanier,
            });
          return elemt;
        });

        let newDataLocalStorage = {
          id: elem._id,
          quantite: Number(elem.quantitePanier),
        };

        this.ChangeQuantiteElem(newDataLocalStorage);

        this.elements = newData;
      }
    },

    // ...
  },
};
</script>


<style  scoped>
.thumbnail {
  margin-right: 20px;
}

.nom {
  cursor: pointer;
}
</style>