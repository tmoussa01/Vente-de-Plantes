<template>
  <div>
    <div v-if="!MODIFIER">
      <div v-for="data in listePlante" :key="data._id">
        <div class="card d">
          <img class="card-img-top" :src="data.plante_img" :alt="data.nom" />
          <div class="card-body">
            <h5 class="card-title">Nom : {{ data.nom }}</h5>
            <p class="card-text">Description : {{ data.description }}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Prix : {{ data.prix }}€</li>
            <li v class="list-group-item danger">
              Catégorie : {{ data.plante_categories.nom }}
            </li>
            <li v class="list-group-item danger">
              Format : {{ data.plante_formats.nom }}
            </li>
            <li v class="list-group-item danger">
              Quantité dans le stock : {{ data.quantite }}
            </li>
            <li v class="list-group-item danger">
              Nombre d'étoile : {{ data.etoile }}
            </li>
            <li v class="list-group-item danger">
              Nombre de vote : {{ data.nbrVote }}
            </li>
            <li v class="list-group-item danger">
              Nombre de vente : {{ data.nbrVente }}
            </li>
          </ul>
          <div class="card-body">
            <a
              @click="modifierPlante(data._id)"
              class="card-link btn btn-danger"
              >Modifier</a
            >
          </div>
        </div>
      </div>
      <hr />
      <PaginationStore
        v-on:new-PlantesData="changementPaginationPlante"
        ComponentName="PlanteComponent"
      />
    </div>
    <ModifierPlante
      key="ModifierPlante"
      v-if="MODIFIER"
      v-bind:idPlante="modifIdPlante"
      v-on:sauvegarder="sauvegarderMethode"
    />
  </div>
</template>

<script>
import PaginationStore from "../paginationStore.vue";
import ModifierPlante from "./modifierPlante.vue";
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  name: "ListePlante",
  components: {
    PaginationStore,
    ModifierPlante,
  },
  data() {
    return {
      MODIFIER: false,
      listePlante: [],
      modifIdPlante: "",
    };
  },
  created() {
    this.getListePLanteStore();
  },
  methods: {
    getListePLanteStore() {
      axios.get(`${URL_backend}/plantes/PlanteByPage/${1}`).then((res) => {
        this.listePlante = res.data;
      });
    },
    changementPaginationPlante(non, page) {
      console.log("non", non);
      axios.get(`${URL_backend}/plantes/PlanteByPage/${page}`).then((res) => {
        this.listePlante = res.data;
      });
    },
    modifierPlante(ID) {
      this.modifIdPlante = ID;
      this.MODIFIER = !this.MODIFIER;
    },
    sauvegarderMethode() {
      this.getListePLanteStore();
      this.MODIFIER = !this.MODIFIER;
    },
  },
};
</script>
<style scoped>
.d {
  font-family: cursive;
  border: 1px solid #46f20733;
  margin: 3% 1%;
  padding: 2%;
  box-shadow: 0 0.5rem 1rem rgba(49, 130, 46, 0.62) !important;
}

.card > img {
  /* width: 100px; */
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}
</style>