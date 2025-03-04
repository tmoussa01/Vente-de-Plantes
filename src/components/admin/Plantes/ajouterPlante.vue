<template>
  <div>
    <button
      @click="nvPlante ? (nvPlante = !nvPlante) : (nvPlante = !nvPlante)"
      class="btn btn-success form-group bn"
    >
      Nouvelle Plante
    </button>

    <form class="d" v-if="nvPlante">
      <div class="form-row">
        <div class="col-md-12">
          <img class="ii" :src="NewDataPlant.plante_img" />

          <div class="fileUpload">
            <input
              @change="onFileNewImg($event)"
              type="file"
              class="upload"
              enctype="multipart/form-data"
            />
            <small>télécharger image</small>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label>Nom</label>
          <input
            v-model="NewDataPlant.nom"
            type="text"
            class="form-control"
            placeholder="Product name"
          />
        </div>
        <div class="form-group col-md-6">
          <label>Prix</label>
          <input
            v-model="NewDataPlant.prix"
            type="number"
            class="form-control"
            placeholder="Product Price"
          />
        </div>
        <div class="form-group col-md-6">
          <label>Quantité en Stock</label>
          <input
            v-model="NewDataPlant.quantite"
            type="number"
            class="form-control"
            placeholder="Quantité en Stock"
          />
        </div>
        <div class="form-group col-md-6">
          <label>Nombre d'étoile</label>
          <input
            v-model="NewDataPlant.etoile"
            type="number"
            class="form-control"
            placeholder="Nombre d'étoile"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label>Nombre de vote</label>
          <input
            v-model="NewDataPlant.nbrVote"
            type="number"
            class="form-control"
            placeholder="Nombre de vote"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label>Nombre de vente</label>
          <input
            v-model="NewDataPlant.nbrVente"
            type="number"
            class="form-control"
            placeholder="Nombre de vente"
            disabled
          />
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <input
          v-model="NewDataPlant.description"
          type="text"
          class="form-control"
          placeholder="Description"
        />
      </div>

      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="inputCategories">Categories</label>
          <select
            v-model="NewDataPlant.plante_categories"
            v-on:change="ChangeNewPlantCat($event)"
            class="form-control"
          >
            <option
              v-for="Catdata in listeCategories"
              :key="Catdata._id"
              :value="Catdata._id"
            >
              {{ Catdata.nom }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="inputFormats">Format</label>
          <select
            v-model="NewDataPlant.plante_formats"
            v-on:change="ChangeNewPlantFormat($event)"
            class="form-control"
          >
            <option
              v-for="FormatData in listeFormats"
              :key="FormatData._id"
              :value="FormatData._id"
            >
              {{ FormatData.nom }}
            </option>
          </select>
        </div>
      </div>

      <button
        @click="AddNewPlant($event)"
        type="submit"
        class="btn btn-primary"
      >
        Ajouter une plante
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  name: "AjouterPlante",
  data() {
    return {
      data: [],
      NewDataPlant: {
        nom: "",
        description: "",
        prix: "",
        plante_img: "",
        plante_categories: "",
        plante_formats: "",
        quantite: 0,
        etoile: 0,
        nbrVote: 0,
        nbrVente: 0,
      },
      fichier: null,
      listeCategories: [],
      listeFormats: [],
      nvPlante: false,
    };
  },
  created() {
    this.getListeCategorie();
    this.getListeFormat();
  },
  methods: {
    getListeCategorie() {
      axios.get(`${URL_backend}/categories/All`).then((res) => {
        this.listeCategories = res.data;
      });
    },
    getListeFormat() {
      axios.get(`${URL_backend}/format/All`).then((res) => {
        this.listeFormats = res.data;
      });
    },
    ChangeNewPlantCat(event) {
      this.NewDataPlant.plante_categories = event.target.value;
    },
    ChangeNewPlantFormat(event) {
      this.NewDataPlant.plante_formats = event.target.value;
    },
    AddNewPlant(e) {
      e.preventDefault();
      if (
        !this.NewDataPlant.nom ||
        !this.NewDataPlant.description ||
        !this.NewDataPlant.prix ||
        !this.NewDataPlant.plante_img ||
        !this.NewDataPlant.plante_categories ||
        !this.NewDataPlant.plante_formats ||
        !this.NewDataPlant.quantite
      ) {
        alert("Attention completer tous les champs");
      } else {
        const dataForm = new FormData();
        dataForm.append("nom", this.NewDataPlant.nom);
        dataForm.append("description", this.NewDataPlant.description);
        dataForm.append("prix", this.NewDataPlant.prix);
        dataForm.append("quantite", this.NewDataPlant.quantite);
        dataForm.append("etoile", this.NewDataPlant.etoile);
        dataForm.append("nbrVote", this.NewDataPlant.nbrVote);
        dataForm.append("nbrVente", this.NewDataPlant.nbrVente);
        dataForm.append(
          "plante_categories",
          this.NewDataPlant.plante_categories
        );
        dataForm.append("plante_formats", this.NewDataPlant.plante_formats);
        for (const index of Object.keys(this.fichier)) {
          dataForm.append("image", this.fichier[index]);
        }
        let token = JSON.parse(localStorage.getItem("Authentification")).Token;
        axios
          .post(`${URL_backend}/plantes`, dataForm, {
            headers: { "x-auth-token": token },
          })
          .then((res) => {
            console.log("nv data plante", res.data);
            this.$emit("NewData");
            this.nvPlante = !this.nvPlante;
          })
          .catch((err) => {
            alert(err.response.data);
          });
      }
    },
    onFileNewImg(event) {
      this.NewDataPlant.plante_img = URL.createObjectURL(event.target.files[0]);
      this.fichier = event.target.files;
    },
  },
};
</script>