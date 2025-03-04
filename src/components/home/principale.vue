<template>
  <div>
    <SuggestionPlante />
    <center>
      <div class="row">
        <div class="col-md-2" style="margin: 1px 0%">
          <div>
            <CategoriePlante
              v-on:toggleCheckCatbox="CheckCategorie"
              key="cat"
            />
            <FormatPlante v-on:toggleCheckFormatbox="CheckFormat" key="cat" />
          </div>
        </div>
      </div>
      <div class="col-md-3"></div>

      <div class="col-md-9 content-right">
        <div class="container">
          <div class="card-group">
            <div class="row" v-if="isLoaded">
              <div
                class="card col-md-3"
                v-for="(elem, index) in elements"
                :key="elem._id"
              >
                <img
                  class="card-img-top"
                  :src="elem.plante_img"
                  :alt="elem.nom"
                />
                <div class="card-body">
                  <h6>Prix : {{ elem.prix }}€</h6>

                  <router-link
                    :to="{
                      path: '/PlanteDescription',
                      query: { ID: elem._id },
                    }"
                    class="card-title vx"
                  >
                    <template v-slot="{ navigate }">
                      <h5 @click="navigate" class="card-title vx">
                        {{ tailleMaxNom(elem.nom) }}
                      </h5>
                    </template>
                  </router-link>
                  <div v-if="elem.quantite > 0">
                    <button
                      v-if="!elem.dansPanier"
                      @click="supprimerDuPanier(elem._id, index)"
                      type="button"
                      class="btn btn-outline-danger"
                    >
                      <small>Retirer du panier</small>
                    </button>
                    <button
                      v-else
                      type="button"
                      class="btn btn-outline-success"
                      @click="ajouterAuPanier(elem._id, index)"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                  <div v-if="userLogin">
                    <button
                      v-if="!elem.dansWishList"
                      @click="ajouterAWishList(elem._id, index)"
                      type="button"
                      class="btn btn-outline-success"
                    >
                      <small>Ajouter à WishList</small>
                    </button>
                    <button
                      v-else
                      type="button"
                      class="btn btn-outline-danger"
                      @click="supprimerDeWishList(elem._id, index)"
                    >
                      Supprimer de la WishList
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <div class="container wid">
          <div class="row">
            <nav aria-label="Page navigation  ">
              <ul class="pagination">
                <li class="page-item">
                  <button
                    class="page-link"
                    @click="pagePrecedentSuivent(false)"
                  >
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                  </button>
                </li>

                <li
                  class="page-item"
                  v-for="(page, index) in tablePage"
                  :key="index"
                >
                  <button
                    :class="
                      selectionPage === page ? 'page-link active' : 'page-link '
                    "
                    @click="changementPage(page)"
                  >
                    {{ page }}
                  </button>
                </li>

                <li class="page-item">
                  <button class="page-link" @click="pagePrecedentSuivent(true)">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </center>
    <div class="clear xp"></div>
  </div>
</template>


<script>
import SuggestionPlante from "./suggestionPlante";
import CategoriePlante from "./categorie";
import FormatPlante from "./format";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  name: "PrincipalePage",
  data() {
    return {
      tablePage: [],
      selectionPage: 3,
      elements: [],
      categorieSelectiones: [],
      formatSelectiones: [],
      isLoaded: true,
      userLogin: false,
    };
  },
  components: {
    CategoriePlante,
    FormatPlante,
    SuggestionPlante,
  },

  computed: {
    ...mapGetters(["tousLesPlantes", "UserAuthentification"]),
  },
  created() {
    this.getDataUtilisateur();

    this.getPlantes();
  },
  mounted() {
    if (!this.$route.query.page) {
      this.$router
        .push({
          path: "/",
          name: "PrincipalePage",
          query: {
            page: 1,
          },
        })
        .catch(() => {});
    }
    this.selectionPage = parseInt(this.$route.query.page) || 1;
    this.getData();
    this.pagination();
  },
  methods: {
    ...mapActions([
      "getUserAuthentication",
      "getPlantes",
      "GetPlanteByNumPage",
      "SupprimerElemDuPanier",
      "SetNewElemPanier",
      "DansPanier",
      "GetWishListByID",
      "ajouterDansWishList",
      "DeleteWish",
    ]),
    getDataUtilisateur() {
      this.getUserAuthentication();
      console.log("ddddddddd", this.UserAuthentification);
      this.userLogin = this.UserAuthentification.connection;
    },
    tailleMaxNom(res) {
      if (res.lenght > 8) return res;
      return res.substr(0, 8) + "...";
    },

    getData() {
      if (
        this.categorieSelectiones.length !== 0 &&
        this.formatSelectiones.length !== 0
      ) {
        // Recherche avec à la fois catégorie et format sélectionnés
        axios
          .post(
            `${URL_backend}/plantes/PlanteByCatAndFormat/${this.selectionPage}`,
            {
              cat: this.categorieSelectiones,
              format: this.formatSelectiones,
            }
          )
          .then((res) => {
            console.log("ici");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data after cat and format check", res.data);
              this.verifierSiDansPanier();
              console.log("this.elements", this.elements);
              if (this.userLogin) {
                this.verifierSiDansWishList();
              }
            }
          });
      } else if (this.categorieSelectiones.length !== 0) {
        // Recherche avec catégorie sélectionnée uniquement
        axios
          .post(`${URL_backend}/plantes/PlanteByCat/${this.selectionPage}`, {
            cat: this.categorieSelectiones,
          })
          .then((res) => {
            console.log("ici");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data after cat check", res.data);
              this.verifierSiDansPanier();
              if (this.userLogin) {
                this.verifierSiDansWishList();
              }
            }
          });
      } else if (this.formatSelectiones.length !== 0) {
        // Recherche avec format sélectionné uniquement
        axios
          .post(`${URL_backend}/plantes/PlanteByFormat/${this.selectionPage}`, {
            format: this.formatSelectiones,
          })
          .then((res) => {
            console.log("ici");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data after format check", res.data);
              this.verifierSiDansPanier();
            }
          });
      } else {
        // Aucune sélection de catégorie ou de format, recherche par page par défaut
        axios
          .get(`${URL_backend}/plantes/PlanteByPage/${this.selectionPage}`)
          .then((res) => {
            console.log("la");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data with out cat and format", res.data);
              this.verifierSiDansPanier();
              if (this.userLogin) {
                this.verifierSiDansWishList();
              }
            }
          });
      }
    },
    verifierSiDansPanier() {
      let nvData = [];
      console.log("this.elements", this.elements);
      for (let index = 0; index < this.elements.length; index++) {
        const element = this.elements[index];
        let dataPanier = JSON.parse(localStorage.getItem("Panier"));
        let objIndex = dataPanier.findIndex((obj) => obj.id == element._id);
        if (objIndex !== -1) {
          element.dansPanier = false;
        } else {
          element.dansPanier = true;
        }
        nvData.push(element);
      }
      this.isLoaded = true;
    },
    async verifierSiDansWishList() {
      console.log("this.elements", this.elements);
      for (let index = 0; index < this.elements.length; index++) {
        const element = this.elements[index];
        let dansWishList = await this.GetWishListByID(element._id);
        console.log("dansWishListffff", dansWishList);

        if (dansWishList) {
          this.elements[index].dansWishList = true;
          console.log(
            "this.elements[index].dansWishList",
            this.elements[index].dansWishList
          );
        } else {
          this.elements[index].dansWishList = false;
          console.log(
            " faslethis.elements[index].dansWishList",
            this.elements[index].dansWishList
          );
        }
      }
      this.isLoaded = true;
      console.log("zzzzzzzzzzzzz", this.elements);
    },
    pagePrecedentSuivent(elem) {
      if (this.selectionPage == 1 && elem == false) {
        console.log("non");
      } else if (elem == false) {
        this.selectionPage = this.selectionPage - 1;
        this.changementPage(this.selectionPage);
        this.pagination();
        this.getData();
        console.log("numer0", this.selectionPage);
      } else {
        // Vérifier si vous êtes à la dernière page avant d'autoriser la page suivante
        if (this.selectionPage < this.tablePage[this.tablePage.length - 1]) {
          this.selectionPage = this.selectionPage + 1;
          this.changementPage(this.selectionPage);
          this.pagination();
          this.getData();
          console.log("numer0 ", this.selectionPage);
        }
      }
    },

    pagination() {
      this.tablePage = [];
      let page = this.selectionPage + 3;
      for (let i = this.selectionPage; i < page; i++) {
        this.tablePage.push(i);
      }
      console.log("pagination", this.tablePage);
      this.getData();
    },
    changementPage(page) {
      this.GetPlanteByNumPage(page);
      this.selectionPage = page;
      this.$router.push({
        path: "/",
        name: "PrincipalePage",
        query: {
          page: page,
        },
      });
    },
    ajouterAuPanier(id, index) {
      this.isLoaded = false;
      this.elements[index].dansPanier = true;
      this.isLoaded = true;

      this.SetNewElemPanier(id);
      this.getData();
    },
    async ajouterAWishList(id, index) {
      this.isLoaded = false;
      this.elements[index].dansWishList = true;
      this.isLoaded = true;
      let data = { id: id };
      console.log("erzerzerzr", this.elements);
      await this.ajouterDansWishList(data);
      this.getData();
    },
    supprimerDuPanier(id, index) {
      this.isLoaded = false;
      this.elements[index].dansPanier = false;
      this.isLoaded = true;
      this.SupprimerElemDuPanier(id);
      this.getData();
    },
    supprimerDeWishList(id, index) {
      this.isLoaded = false;
      this.elements[index].dansWishList = false;
      this.isLoaded = true;
      console.log("deleteis", id);
      this.DeleteWish(id);
      this.getData();
    },
    CheckCategorie(categorie) {
      console.log("main vue cat id", categorie);
      if (this.categorieSelectiones.indexOf(categorie) === -1) {
        this.categorieSelectiones.push(categorie);
      } else {
        this.categorieSelectiones = this.categorieSelectiones.filter(
          (e) => e !== categorie
        );
      }
      console.log("dans CheckCategorie", this.categorieSelectiones);
      this.searchWithCategoriesAndFormats();
    },

    CheckFormat(format) {
      console.log("main vue format id", format);
      if (this.formatSelectiones.indexOf(format) === -1) {
        this.formatSelectiones.push(format);
      } else {
        this.formatSelectiones = this.formatSelectiones.filter(
          (e) => e !== format
        );
      }
      console.log("dans CheckFormat", this.formatSelectiones);
      this.searchWithCategoriesAndFormats();
    },

    searchWithCategoriesAndFormats() {
      if (
        this.categorieSelectiones.length !== 0 &&
        this.formatSelectiones.length !== 0
      ) {
        // Recherche avec à la fois catégorie et format sélectionnés
        console.log("PlanteByCatAndFormat");
        axios
          .post(
            `${URL_backend}/plantes/PlanteByCatAndFormat/${this.selectionPage}`,
            {
              cat: this.categorieSelectiones,
              format: this.formatSelectiones,
            }
          )
          .then((res) => {
            console.log("ici");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data after cat and format check", res.data);
              this.verifierSiDansPanier();
              if (this.userLogin) {
                this.verifierSiDansWishList();
              }
            }
          });
      } else if (this.categorieSelectiones.length !== 0) {
        // Recherche avec catégorie sélectionnée uniquement
        axios
          .post(`${URL_backend}/plantes/PlanteByCat/${this.selectionPage}`, {
            cat: this.categorieSelectiones,
          })
          .then((res) => {
            console.log("ici");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data after cat check", res.data);
              this.verifierSiDansPanier();
              if (this.userLogin) {
                this.verifierSiDansWishList();
              }
            }
          });
      } else if (this.formatSelectiones.length !== 0) {
        console.log("formatSelectiones");
        // Recherche avec format sélectionné uniquement
        axios
          .post(`${URL_backend}/plantes/PlanteByFormat/${this.selectionPage}`, {
            format: this.formatSelectiones,
          })
          .then((res) => {
            console.log("ici");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data after format check", res.data);
              this.verifierSiDansPanier();
            }
          });
      } else {
        // Aucune sélection de catégorie ou de format, recherche par page par défaut
        axios
          .get(`${URL_backend}/plantes/PlanteByPage/${this.selectionPage}`)
          .then((res) => {
            console.log("la");
            if (res.data.length) {
              this.isLoaded = false;
              this.elements = res.data;
              console.log("data with out cat and format", res.data);
              this.verifierSiDansPanier();
              if (this.userLogin) {
                this.verifierSiDansWishList();
              }
            }
          });
      }
    },
  },
};
</script>

<style scoped>
.card {
  margin: 1% auto;
}
.content-right {
  margin-left: 136px;
}
.wid {
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}

.active,
.active:hover {
  background-color: #43c163;
  color: white;
}

.vx:hover {
  cursor: pointer;
  color: #51a270;
}
.card > img {
  width: 100%;
  height: 12rem;
  margin: 3px auto !important;
}
</style>               