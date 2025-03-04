<template>
  <div>
    <center>
      <div class="card" v-if="isLoaded">
        <img
          class="card-img-top"
          :src="PlanteInfo.imgSrc"
          alt="image de la plante"
        />
        <div class="card-body">
          <h4 class="card-title">{{ PlanteInfo.nom }}</h4>
          <p class="card-text">{{ PlanteInfo.description }}</p>
          <h4>prix : {{ PlanteInfo.prix }}€</h4>
          <h4><i class="fas fa-tags"></i> : {{ PlanteInfo.nomCategorie }}</h4>
          <div v-if="PlanteInfo.quantite > 0">
            <a
              class="btn btn-outline-success"
              @click="changementStatusPlante"
              v-if="!PlanteInfo.dansPanier"
            >
              Ajouter au panier</a
            >
            <a
              class="btn btn-outline-danger"
              @click="changementStatusPlante"
              v-if="PlanteInfo.dansPanier"
            >
              Retirer du panier</a
            >
          </div>
        </div>
      </div>
    </center>
  </div>
</template>

<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
import { mapActions } from "vuex";
export default {
  name: "PlanteDescription",
  data() {
    return {
      PlanteInfo: {
        id: "",
        imgSrc: "",
        nom: "",
        prix: null,
        description: "",
        nomCategorie: "",
        quantite: 0,
        dansPanier: true,
      },
      element: "",
      isLoaded: Boolean,
    };
  },
  created() {
    this.getDataRoute();
  },
  methods: {
    ...mapActions([
      "GetPlanteByID",
      "GetCatByID",
      "GetCategories",
      "DansPanier",
      "SetNewElemPanier",
      "SupprimerElemDuPanier",
      "SetUserPanierMouvement",
    ]),
    async getDataRoute() {
      try {
        let plantId = this.$route.query.ID;

        const planteResponse = await axios.get(
          `${URL_backend}/plantes/${plantId}`
        );
        this.resetgetCategorie(planteResponse.data);

        const dansPanierResponse = await this.DansPanier(plantId);
        this.PlanteInfo.dansPanier = dansPanierResponse;

        this.isLoaded = true;
        this.ajouterMouvementUtilisateur();
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    },
    async resetgetCategorie(data) {
      this.PlanteInfo.id = data["_id"];
      this.PlanteInfo.nom = data["nom"];
      this.PlanteInfo.description = data["description"];
      this.PlanteInfo.prix = data["prix"];
      this.PlanteInfo.imgSrc = data["plante_img"];
      let idCategorie = data["plante_categories"]._id;
      this.PlanteInfo.quantite = data["quantite"];

      try {
        const categorieResponse = await axios.get(
          `${URL_backend}/categories/${idCategorie}`
        );
        this.PlanteInfo.nomCategorie = categorieResponse.data.nom;
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération de la catégorie :",
          error
        );
      }
    },
    async changementStatusPlante() {
      try {
        let idPlante = this.$route.query.ID;

        if (this.PlanteInfo.dansPanier) {
          // Supprimer l'élément du panier
          await this.SupprimerElemDuPanier(idPlante);
        } else {
          // Ajouter l'élément au panier
          await this.SetNewElemPanier(idPlante);
        }

        // Mettre à jour le statut dans le composant
        this.PlanteInfo.dansPanier = !this.PlanteInfo.dansPanier;
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      } finally {
        // Rétablir la charge à true après l'opération
        this.isLoaded = true;
      }
    },

    ajouterMouvementUtilisateur() {
      try {
        this.SetUserPanierMouvement(this.PlanteInfo.id);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de l'ajout du mouvement utilisateur :",
          error
        );
      }
    },
  },
};
</script>


<style scoped>
.card {
  width: 40%;
  text-align: center;
}

.card > img {
  width: 70% !important;
  margin: 1px auto !important;
}
</style>
