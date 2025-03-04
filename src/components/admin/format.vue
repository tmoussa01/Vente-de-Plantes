<template>
  <center>
    <div>
      <h5 class="btn-danger">format</h5>
      <!-- add new Cat start -->
      <input
        class="form-group bn"
        type="text"
        placeholder="Nom de catégorie"
        v-model="nouveauFormat"
      />
      <button @click="AddNewForm" class="btn btn-success form-group bn">
        Nouvelle format
      </button>
      <div v-if="erreur !== ''" class="alert alert-danger" role="alert">
        {{ erreur }}
      </div>
      <ul v-for="data in newListFormats" :key="data._id" class="list-group m">
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
        ComponentName="formatComponent"
        v-on:new-formatData="NewDataFormat"
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
  name: "FormatPage",
  data() {
    return {
      listFormats: [],
      newListFormats: [],
      nouveauFormat: "",
      numPage: null,
      erreur: "",
    };
  },
  components: {
    PaginationStore,
  },
  computed: {
    ...mapGetters(["toutesLesFormat"]),
  },
  mounted() {
    this.GetFormListFromStore();
    this.ajoutModifierFormat();
  },
  created() {
    this.GetFormats();
    this.$store.watch((state) => {
      console.log("store change format.vue", state);
      this.GetFormListFromStore();
      this.ajoutModifierFormat();
    });
  },
  methods: {
    ...mapActions([
      "GetFormats",
      "ajouterForm",
      "modifierForm",
      "supprimerFormat",
    ]),
    GetFormListFromStore() {
      console.log(
        "dans la function GetFormListFromStore",
        this.toutesLesFormat
      );
      this.listFormats = this.toutesLesFormat;
      console.log("dans GetFormListFromStore", this.listFormats);
    },
    ajoutModifierFormat() {
      let newData = [];
      console.log("liste des format lenght", this.listFormats.length);
      for (let index = 0; index < this.listFormats.length; index++) {
        let _id = this.listFormats[index]["_id"];
        let nom = this.listFormats[index]["nom"];
        newData.push({ _id, nom, isEdit: false });
      }
      console.log("liste des format", newData);
      this.newListFormats = [];
      this.newListFormats = newData;
      console.log("icii", this.newListFormats);
    },
    saveApreModification(ID, projectData) {
      console.log("id", ID, "projectdata", projectData["nom"]);
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;

      let data = { ID, nom: projectData["nom"] };
      axios
        .put(
          `${URL_backend}/format/${data.ID}`,
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
      this.ajoutModifierFormat();
    },
    AddNewForm() {
      let data = { NewCatNom: this.nouveauFormat };
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;

      axios
        .post(
          `${URL_backend}/format`,
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

      this.ajoutModifierFormat();
    },
    supprimer: function (ID) {
      let data = { ID };
      this.supprimerFormat(data);
      this.GetFormListFromStore();
      this.ajoutModifierFormat();
    },
    NewDataFormat(data, page) {
      this.numPage = page;
      this.listFormats = data;
      this.ajoutModifierFormat();
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
























