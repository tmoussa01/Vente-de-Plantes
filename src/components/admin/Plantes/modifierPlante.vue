<template>
  <div>
    <form class="d">
      <div class="form-row">
        <div class="col-md-12">
          <img class="ii" :src="data.plante_img" />

          <div class="fileUpload">
            <input
              @change="onFileChange($event)"
              type="file"
              class="upload"
              enctype="multipart/form-data"
            />
            <span>Modifier</span>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label>Nom</label>
          <input
            v-model="data.nom"
            type="text"
            class="form-control"
            placeholder="Nom de la plante"
          />
        </div>
        <div class="form-group col-md-6">
          <label>Prix</label>
          <input
            v-model="data.prix"
            type="number"
            class="form-control"
            placeholder="Prix de la plante"
          />
        </div>
        <div class="form-group col-md-6">
          <label>Quantite dans le stock</label>
          <input
            v-model="data.quantite"
            type="number"
            class="form-control"
            placeholder="Quantite dans le stock"
          />
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <input
          v-model="data.description"
          type="text"
          class="form-control"
          placeholder="Description"
        />
      </div>

      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="inputCategories">Categories</label>
          <select
            @change="ChangeCatPlante($event, data._id)"
            class="form-control"
          >
            <option
              v-for="catdata in listeCategories"
              :key="catdata._id"
              :selected="categorieChecking(catdata._id)"
              :value="catdata._id"
            >
              {{ catdata.nom }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="inputFormats">Formats</label>
          <select
            @change="ChangeFormatPlante($event, data._id)"
            class="form-control"
          >
            <option
              v-for="FormData in listeFormat"
              :key="FormData._id"
              :selected="FormatChecking(FormData._id)"
              :value="FormData._id"
            >
              {{ FormData.nom }}
            </option>
          </select>
        </div>
      </div>

      <button
        @click="sauvegarder($event, data._id, data)"
        class="btn btn-primary"
      >
        Sauvegarder
      </button>

      <button @click="deleteElem($event, data._id)" class="btn btn-success">
        Supprimer
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  name: "ModifierPlante",
  props: ["idPlante"],
  data() {
    return {
      data: [],
      idplante: this.idPlante,
      fichier: null,
      listeCategories: [],
      listeFormat: [],
    };
  },
  created() {
    this.recuperationInfoPlante();
    this.getListeCategorieStore();
    this.getListeFormatStore();
  },
  methods: {
    getListeCategorieStore() {
      axios.get(`${URL_backend}/categories/All`).then((res) => {
        this.listeCategories = res.data;
      });
    },
    getListeFormatStore() {
      axios.get(`${URL_backend}/format/All`).then((res) => {
        this.listeFormat = res.data;
      });
    },
    recuperationInfoPlante() {
      axios.get(`${URL_backend}/plantes/${this.idplante}`).then((res) => {
        let dataPlante = {
          _id: res.data._id,
          nom: res.data.nom,
          description: res.data.description,
          prix: res.data.prix,
          quantite: res.data.quantite,

          plante_img: res.data.plante_img,
          idCategorie: res.data.plante_categories._id,
          idFormat: res.data.plante_formats._id,
        };
        this.data = dataPlante;
      });
    },
    sauvegarder(event) {
      event.preventDefault();
      if (
        !this.data.nom ||
        !this.data.description ||
        !this.data.prix ||
        !this.data.plante_img
      ) {
        alert(" le formulaire est incomplet veillez compléter tous les champs");
      } else {
        console.log("sauvegarde", this.data);
        const dataEnvoi = new FormData();
        dataEnvoi.append("nom", this.data.nom);
        dataEnvoi.append("description", this.data.description);
        dataEnvoi.append("prix", this.data.prix);
        dataEnvoi.append("quantite", this.data.quantite);
        dataEnvoi.append("plante_img", this.data.plante_img);
        dataEnvoi.append("plante_categories", this.data.idCategorie);
        dataEnvoi.append("plante_formats", this.data.idFormat);

        if (this.fichier !== null) {
          for (const i of Object.keys(this.fichier)) {
            dataEnvoi.append("image", this.fichier[i]);
          }
        }
        const token = JSON.parse(
          localStorage.getItem("Authentification")
        ).Token;
        axios
          .put(`${URL_backend}/plantes/${this.data._id}`, dataEnvoi, {
            headers: { "x-auth-token": token },
          })
          .then((res) => {
            console.log("nv data plante", res.data);
            this.$emit("sauvegarder");
          })
          .catch((err) => {
            console.log("err", err.response);
            alert(err.response.data);
          });
      }
    },
    onFileChange(event) {
      this.data.plante_img = URL.createObjectURL(event.target.files[0]);
      this.fichier = event.target.files;
    },
    categorieChecking(id) {
      if (String(this.data.idCategorie) === String(id)) {
        return true;
      } else {
        return false;
      }
    },
    FormatChecking(id) {
      if (String(this.data.idFormat) === String(id)) {
        return true;
      } else {
        return false;
      }
    },
    ChangeCatPlante(event) {
      this.data.idCategorie = event.target.value;
    },
    ChangeFormatPlante(event) {
      this.data.idFormat = event.target.value;
    },
    deleteElem(event, id) {
      event.preventDefault();
      const token = JSON.parse(localStorage.getItem("Authentification")).Token;
      axios
        .delete(`${URL_backend}/plantes/${id}`, {
          headers: { "x-auth-token": token },
        })
        .then((res) => {
          console.log("supprimer element plante", res);
          this.$emit("sauvegarder");
        })
        .catch((err) => {
          console.log("err", err.response.data.msg);
        });
    },
  },
};
</script>
<style  scoped>
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

.im {
  max-width: 10%;
  border-radius: 50%;
}

.d {
  font-family: cursive;
  border: 1px solid #2f4f4f1f;
  margin: 3% 1%;
  padding: 2%;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card > img {
  /* width: 100px; */
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}
.ii {
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}

.fileUpload {
  background: #00bcbe;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
  color: #fff;
  font-size: 1em;
  font-weight: bold;
  margin: 1.25em auto; /*20px/16px 0*/
  overflow: hidden;
  padding: 0.875em; /*14px/16px*/
  position: relative;
  text-align: center;
  width: 120px;
  cursor: pointer;
}
.fileUpload:hover,
.fileUpload:active,
.fileUpload:focus {
  background: #00a2a4;
  cursor: pointer;
}
.fileUpload input.upload {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
  width: 148px;
  height: 46px;
  cursor: pointer;
}
</style>
