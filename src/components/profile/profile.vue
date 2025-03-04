<template>
  <div>
    <center>
      <h4 class="s">
        Mon Profile
        <button
          v-if="modeModification"
          @click="modifierData"
          class="btn btn-danger"
        >
          Modifier
        </button>
        <button
          v-if="!modeModification"
          @click="sauvegarderData"
          class="btn btn-info"
        >
          Sauvegarder
        </button>
      </h4>
      <div v-if="modeModification">
        <img class="iimg col" :src="dataUtilisateur.imgSrc" alt="" />
        <div class="container">
          <div class="row">
            <div class="col-md-8 d">
              <h3>
                Nom :
                <strong class="s">{{ dataUtilisateur.nom }}</strong>
              </h3>
              <h3>
                Prenom :
                <strong class="s">{{ dataUtilisateur.prenom }}</strong>
              </h3>
              <h3>
                Email :
                <strong class="s">{{ dataUtilisateur.email }}</strong>
              </h3>

              <h3>
                Date de naissance :
                <strong class="s">{{ dataUtilisateur.dateNaissance }}</strong>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!modeModification">
        <img class="iimg col" :src="dataUtilisateur.imgSrc" alt="" />
        <div class="fileUpload">
          <input
            type="file"
            @change="changementImage"
            class="upload"
            enctype="multipart/form-data"
          />
          <span>Changer image</span>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-8 d">
              <h3>
                Nom :
                <strong class="s">{{ dataUtilisateur.nom }}</strong>
                <input
                  class="form-control"
                  v-model="dataUtilisateur.nom"
                  placeholder="Nom"
                  type="text"
                />
              </h3>
              <h3>
                Prenom :
                <strong class="s">{{ dataUtilisateur.prenom }}</strong>
                <input
                  class="form-control"
                  v-model="dataUtilisateur.prenom"
                  placeholder="prenom"
                  type="text"
                />
              </h3>
              <h3>
                Email :
                <strong class="s">{{ dataUtilisateur.email }}</strong>
                <input
                  class="form-control"
                  v-model="dataUtilisateur.email"
                  disabled
                  placeholder="Email"
                  type="email"
                />
              </h3>

              <h3>
                Date de naissance :
                <strong class="s">{{ dataUtilisateur.dateNaissance }}</strong>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="date"
                      v-model="dataUtilisateur.dateNaissance"
                      class="form-control"
                    />
                  </div>
                </div>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <button @click="suppimerCompte" class="btn btn-danger">
        Supprimer mon compte
      </button>
    </center>
  </div>
</template>


<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
import { mapActions } from "vuex";
export default {
  name: "ProfilePage",
  data() {
    return {
      modeModification: true,
      dataUtilisateur: {},
      fichier: null,
      lectureFichier: null,
    };
  },
  created() {
    const token = JSON.parse(localStorage.getItem("Authentification")).Token;
    axios
      .get(`${URL_backend}/utilisateurs/me`, {
        headers: { "x-auth-token": token },
      })
      .then((res) => {
        let nvList = {
          userID: res.data._id,
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          dateNaissance: res.data.dateNaissance,
          imgSrc: res.data.img_profile,
        };
        this.dataUtilisateur = nvList;
      })
      .catch((err) => {
        console.log("err", err.response.data.msg);
      });
  },
  methods: {
    ...mapActions(["SetUserAuthentification"]),
    sauvegarderData() {
      this.modeModification = !this.modeModification;
      const token = JSON.parse(localStorage.getItem("Authentification")).Token;
      const nvData = new FormData();
      nvData.append("nom", this.dataUtilisateur.nom);
      nvData.append("prenom", this.dataUtilisateur.prenom);
      nvData.append("email", this.dataUtilisateur.email);
      nvData.append("dateNaissance", this.dataUtilisateur.dateNaissance);
      nvData.append("img_profile", this.dataUtilisateur.imgSrc);

      if (this.fichier !== null) {
        for (const i of Object.keys(this.fichier)) {
          nvData.append("image", this.fichier[i]);
        }
      }
      axios
        .put(`${URL_backend}/utilisateurs/`, nvData, {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("res mise à jour des données de l'utilisateur", res.data);
        })
        .catch((err) => {
          console.log("err", err.response.data.msg);
        });
    },
    modifierData() {
      this.modeModification = !this.modeModification;
    },
    changementImage(event) {
      this.dataUtilisateur.imgSrc = URL.createObjectURL(event.target.files[0]);
      this.fichier = event.target.files;
    },
    suppimerCompte() {
      const token = JSON.parse(localStorage.getItem("Authentification")).Token;
      axios
        .delete(`${URL_backend}/utilisateurs/`, {
          headers: { "x-auth-token": token },
        })
        .then((res) => {
          console.log("utilisateur supprimé avec succès", res.data);
          this.deconnexion();
        })
        .catch((err) => {
          console.log("err"), err.response.data.msg;
        });
    },
    deconnexion() {
      let data = { connexion: false, role: null };
      this.SetUserAuthentification(data);
      this.$router.push({ path: "/" });
    },
  },
};
</script>



<style  scoped>
.iimg {
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}
.d {
  font-family: cursive;
  border: 1px solid #2f4f4f1f;
  margin: 1% auto;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.s {
  color: darkslategrey;
  font-family: fantasy;
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

input[type="file"] {
  position: fixed;
  right: 100%;
  bottom: 100%;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
</style>







