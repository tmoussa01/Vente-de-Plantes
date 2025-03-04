<template>
  <div>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          <div v-if="!tokenValidate" class="card">
            <h5 class="card-title text-center">
              <strong>mise à jour de votre mot de passe</strong>
            </h5>
            <div class="alert alert-warning mt-4">
              <p>Vous avez cliquer sur le mauvais lien</p>
              <p>
                <a href="/ConnexionInscription" class="btn btn-primary">
                  connexion
                  <i class="bi bi-arrow-right"></i>
                </a>
              </p>
            </div>
          </div>

          <div v-if="tokenValidate" class="card" style="color: #001e5f">
            <h4 class="card-title font-weight-bold">
              Changement de mot de passe pour: {{ email }}
            </h4>
            <form @submit.prevent="passwordReset" class="mt-4">
              <div class="form-group">
                <label for="input-password" class="font-weight-bold"
                  >Nouveau mot de passe</label
                >
                <input
                  v-model="newPassword"
                  id="input-password"
                  type="password"
                  class="form-control"
                  required
                />
              </div>

              <div class="form-group">
                <label for="input-2-password" class="font-weight-bold"
                  >Confirmation mot de passe</label
                >
                <input
                  v-model="confirmPassword"
                  id="input-2-password"
                  type="password"
                  class="form-control"
                  required
                />
              </div>

              <div class="row">
                <div class="col-6">
                  <button
                    class="btn btn-warning btn-block mt-2 font-weight-bold"
                    type="submit"
                  >
                    envoyer
                  </button>
                </div>
              </div>
              <div v-if="erreur !== ''" class="alert alert-danger" role="alert">
                {{ erreur }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  nam: "resetPasswordForm",
  data() {
    return {
      userId: null,
      emailResetPassword: null,
      mailSent: false,
      email: null,
      newPassword: null,

      confirmPassword: null,
      tokenValidate: true,
      erreur: "",
    };
  },

  async mounted() {
    this.email = this.$route.query.email;
    try {
      const dataUser = {
        email: this.$route.query.email,
        registerToken: this.$route.query.token,
      };
      await axios
        .post(
          `${URL_backend}/authentification/verificationTokenResetPass`,
          dataUser
        )
        .then((res) => {
          console.log("res inscription", res);
          this.userId = res.data._id;
        });
      console.log("id", this.userId);
    } catch (error) {
      this.tokenValidate = false;
      console.log(error.response.data.error);
    }
  },
  methods: {
    async passwordReset() {
      if (this.newPassword == null || this.newPassword.length < 8) {
        this.erreur = " mot de passe doit contenir 8 charactère minimum!";
        return;
      }
      if (this.confirmPassword == null || this.confirmPassword.length < 8) {
        this.erreur =
          "confirmation  mot de passe doit contenir 8 charactère minimum!";
        return;
      }
      if (this.confirmPassword !== this.newPassword) {
        this.erreur =
          "confirmation  mot de passe et mot de passe ne sont pas identique!";
        return;
      }

      try {
        this.erreur = "";
        console.log("this.userId", this.userId);
        const dataUser = { id: this.userId, password: this.newPassword };
        await axios.post(
          `${URL_backend}/authentification/resetPassword`,
          dataUser
        );
        console.log("ici dans connection");
        this.$router.push({ path: "/ConnexionInscription" });
      } catch (error) {
        console.log(error.response.data.error);
      }
    },
  },
};
</script>
