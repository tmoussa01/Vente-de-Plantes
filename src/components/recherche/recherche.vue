<template>
  <center>
    <div>
      <h3>
        Resultat :
        <small>{{ dataRecherche }}</small>
      </h3>

      <div class="col-md-9">
        <div class="container">
          <div class="card-group">
            <transition-group name="fade" tag="div" class="row">
              <div
                class="card col-md-4"
                v-for="elem in resultat"
                :key="elem._id"
              >
                <img class="card-img-top" :src="elem.plante_img" />
                <div class="card-body">
                  <h6>Prix: {{ elem.prix }}</h6>
                  <h5 class="card-title">titre</h5>
                  <router-link
                    :to="{
                      path: '/PlanteDescription',
                      query: { ID: elem._id },
                    }"
                    class="card-title"
                    >{{ elem.nom }}
                  </router-link>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </center>
</template>



<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
import { mapActions } from "vuex";
export default {
  name: "RecherchePage",
  data() {
    return {
      dataRecherche: "",
      resultat: [],
    };
  },
  methods: {
    ...mapActions(["SetUserRechercheMouvement"]),
    async rechercheRes() {
      await axios
        .get(`${URL_backend}/plantes/recherche/${this.dataRecherche}`)
        .then((res) => {
          this.resultat = res.data;
          this.SetUserRechercheMouvement(this.resultat);
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche :", error);
        });
    },
  },

  watch: {
    $route(to, from) {
      this.dataRecherche = to.query.dataRech;
      this.rechercheRes();
      from;
    },
  },
  mounted() {
    this.dataRecherche = this.$route.query.dataRech;
    this.rechercheRes();
  },
};
</script>