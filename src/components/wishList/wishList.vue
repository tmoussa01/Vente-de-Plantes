<template>
  <div>
    <center>
      <div class="col-md-3"></div>

      <div class="col-md-9 content-right">
        <div class="container">
          <div class="card-group">
            <div class="row">
              <div
                class="card col-md-3"
                v-for="elem in elements"
                :key="elem._id"
              >
                <img
                  class="card-img-top"
                  :src="elem.plante.plante_img"
                  :alt="elem.plante.nom"
                />
                <div class="card-body">
                  <h6>Prix : {{ elem.plante.prix }}€</h6>

                  <router-link
                    :to="{
                      path: '/PlanteDescription',
                      query: { ID: elem.plante._id },
                    }"
                    class="card-title vx"
                  >
                    <template v-slot="{ navigate }">
                      <h5 @click="navigate" class="card-title vx">
                        {{ tailleMaxNom(elem.plante.nom) }}
                      </h5>
                    </template>
                  </router-link>
                  <div>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="supprimerDeWishList(elem.plante._id)"
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
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  name: "WishListPage",
  data() {
    return {
      tablePage: [],
      selectionPage: 5,
      elements: [],
    };
  },
  components: {},

  computed: {
    ...mapGetters(["tousWistList"]),
  },
  created() {
    this.getPlanteDansWishList();
  },
  mounted() {
    this.selectionPage = parseInt(this.$route.query.page) || 1;
    this.pagination();
  },
  methods: {
    ...mapActions(["getWishList", "DeleteWish", "GetWishListByNumPage"]),
    tailleMaxNom(res) {
      if (res.lenght > 8) return res;
      return res.substr(0, 8) + "...";
    },
    async getPlanteDansWishList() {
      await this.getWishList();
      this.elements = this.tousWistList;
    },

    getData() {
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;
      axios
        .get(`${URL_backend}/wishList/WishListByPage/${this.selectionPage}`, {
          headers: { "x-auth-token": token },
        })
        .then((res) => {
          if (res.data.length) {
            this.elements = res.data;
          }
        });
    },

    pagePrecedentSuivent(elem) {
      if (this.selectionPage == 1 && elem == false) {
        console.log("non");
      } else if (elem == false) {
        this.selectionPage = this.selectionPage - 1;
        this.changementPage(this.selectionPage);
        this.pagination();
        this.getData();
      } else {
        if (this.selectionPage < this.tablePage[this.tablePage.length - 1]) {
          this.selectionPage = this.selectionPage + 1;
          this.changementPage(this.selectionPage);
          this.pagination();
          this.getData();
        }
      }
    },

    pagination() {
      this.tablePage = [];
      let page = this.selectionPage + 3;
      for (let i = this.selectionPage; i < page; i++) {
        this.tablePage.push(i);
      }
      this.getData();
    },
    changementPage(page) {
      this.GetWishListByNumPage(page);
      this.selectionPage = page;
      this.$router.push({
        path: "/",
        name: "wishList",
        query: {
          page: page,
        },
      });
    },

    supprimerDeWishList(id) {
      this.DeleteWish(id);
      this.getData();
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