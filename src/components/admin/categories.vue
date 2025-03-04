<template>
  <center>
    <div>
      <h5 class="btn-danger">Categories</h5>
      <!-- add new Cat start -->
      <input
        class="form-group bn"
        type="text"
        placeholder="Nom de catégorie"
        v-model="nouveauCategorie"
      />
      <button @click="AddNewCat" class="btn btn-success form-group bn">
        Nouvelle categorie
      </button>
      <div v-if="erreur !== ''" class="alert alert-danger" role="alert">
        {{ erreur }}
      </div>
      <ul
        v-for="data in newListCategories"
        :key="data._id"
        class="list-group m"
      >
        <li
          class="z list-group-item d-flex justify-content-between align-items-center"
        >
          <input type="text" v-model="data.nom" v-if="data.isEdit" />
          {{ data.nom }}
          <div class="form-group">
            <button
              class="form-control btn btn-primary"
              v-if="!data.isEdit"
              @click="data.isEdit = !data.isEdit"
            >
              Modifier
            </button>
            <button
              class="form-control btn btn-success"
              v-if="data.isEdit"
              @click="saveApreModification(data._id, data)"
            >
              Sauvegarder
            </button>
            <!-- delete item -->
            <button
              class="form-control btn btn-danger"
              v-if="!data.isEdit"
              @click="supprimer(data._id)"
            >
              Supprimer
            </button>
          </div>
        </li>
      </ul>
      <hr />
      <PaginationStore
        ComponentName="categorieComponent"
        v-on:new-CategorieData="NewDataCategorie"
      />
    </div>
  </center>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
import PaginationStore from "./paginationStore";
export default {
  name: "CategoriesPage",
  data() {
    return {
      listCategories: [],
      newListCategories: [],
      nouveauCategorie: "",
      numPage: null,
      erreur: "",
    };
  },
  components: {
    PaginationStore,
  },
  computed: {
    ...mapGetters(["toutesLesCategorie"]),
  },
  mounted() {
    this.GetCatListFromStore();
    this.ajoutModifierListCategerie();
  },
  created() {
    this.GetCategories();
    this.$store.watch((state) => {
      console.log("store change cat.vue", state);
      this.GetCatListFromStore();
      this.ajoutModifierListCategerie();
    });
  },
  methods: {
    ...mapActions([
      "GetCategories",
      "ajouterCat",
      "modifierCat",
      "supprimerCat",
    ]),
    GetCatListFromStore() {
      console.log(
        "dans la function GetCatListFromStore",
        this.toutesLesCategorie
      );
      this.listCategories = this.toutesLesCategorie;
      console.log("dans GetCatListFromStore", this.listCategories);
    },
    ajoutModifierListCategerie() {
      let newData = [];
      console.log("liste des categorie lenght", this.listCategories.length);
      for (let index = 0; index < this.listCategories.length; index++) {
        let _id = this.listCategories[index]["_id"];
        let nom = this.listCategories[index]["nom"];
        newData.push({ _id, nom, isEdit: false });
      }
      console.log("liste des categorie", newData);
      this.newListCategories = [];
      this.newListCategories = newData;
      console.log("icii", this.newListCategories);
    },
    saveApreModification(ID, projectData) {
      console.log("id", ID, "projectdata", projectData["nom"]);
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;

      let data = { ID, nom: projectData["nom"] };
      axios
        .put(
          `${URL_backend}/categories/${data.ID}`,
          {
            nom: data.nom,
          },
          { headers: { "x-auth-token": token } }
        )
        .then(() => {})
        .catch((err) => {
          this.erreur = err.response.data;
        });
      this.erreur = "";
      this.ajoutModifierListCategerie();
    },
    AddNewCat() {
      let data = { NewCatNom: this.nouveauCategorie };
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;

      axios
        .post(
          `${URL_backend}/categories`,
          {
            nom: data.NewCatNom,
          },
          { headers: { "x-auth-token": token } }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          this.erreur = err.response.data;
        });
      this.erreur = "";

      this.ajoutModifierListCategerie();
    },
    supprimer: function (ID) {
      let data = { ID };
      this.supprimerCat(data);
      this.GetCatListFromStore();
      this.ajoutModifierListCategerie();
    },
    NewDataCategorie(data, page) {
      this.numPage = page;
      this.listCategories = data;
      this.ajoutModifierListCategerie();
    },
  },
};
</script>

<style  scoped>
.userimg {
  max-width: 10%;
  border-radius: 50%;
}
.m {
  margin: 10px auto;
}

.wid {
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}
.z {
  font-size: 14px;
  font-weight: bold;
}

.bn {
  margin: 5px;
}
</style>
























