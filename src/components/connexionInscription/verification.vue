<template>
  <div class="signup-container">
    <section class="contact-form pt-4">
      <div class="container">
        <div class="row mt-12">
          <div class="col-md-6 mx-auto register">
            <div class="form-wrapper">
              <div class="text-center mb-4">
                <h4 class="title">Vérification de votre email</h4>
              </div>
              <!-- Message de redirection vers Inscription -->
              <div v-if="userId === 0" class="alert alert-success text-center">
                <p>Votre email n'est pas encore enregistré.</p>
                <a href="/Inscription" class="btn modern-button">
                  Créer un compte
                </a>
              </div>

              <!-- Formulaire de vérification avec OTP Inputs -->
              <div v-else>
                <!-- Message d'erreur global -->
                <div v-if="codeVerificationMessage" class="alert alert-danger">
                  {{ codeVerificationMessage }}
                </div>

                <form @submit.prevent="verifyRegsToken">
                  <div class="form-group text-center">
                    <label>
                      Entrez le code que nous avons envoyé à
                      <strong>{{ userEmail }}</strong
                      >. Si vous ne le recevez pas, vérifiez votre dossier de
                      spam.
                    </label>
                    <div class="otp-input-group">
                      <input
                        v-for="(digit, index) in otpCode"
                        :key="index"
                        type="text"
                        class="form-control modern-input otp-input"
                        v-model="otpCode[index]"
                        :ref="'otp' + index"
                        maxlength="1"
                        @keypress="onlyNumber"
                        @input="moveToNext(index, $event)"
                        @keydown.backspace="moveToPrevious(index, $event)"
                        required
                      />
                    </div>

                    <small class="text-muted">
                      Code de vérification de 5 chiffres
                    </small>
                  </div>

                  <!-- Bouton de soumission avec loader -->
                  <div class="text-center mt-3">
                    <button
                      type="submit"
                      class="btn modern-button"
                      :disabled="loading || otpCode.includes('')"
                    >
                      <span
                        v-if="loading"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span v-else>Soumettre</span>
                    </button>
                  </div>

                  <!-- Option pour renvoyer le code -->
                  <div class="mt-4 text-center">
                    <p>
                      Vous pouvez renvoyer le code si vous ne l'avez pas reçu.
                    </p>
                    <button
                      class="btn btn-info mt-2 modern-button"
                      @click="tryAgain"
                      :disabled="loading"
                    >
                      Renvoyer le code
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
import { mapActions } from "vuex";

export default {
  name: "UserVerify",

  data() {
    return {
      userId: 0,
      userEmail: "",
      registerTokenValidation: null,
      codeVerificationMessage: "",
      otpCode: ["", "", "", "", ""], // Pour stocker chaque chiffre
      idRole: "",
      loading: false,
    };
  },
  mounted() {
    this.userId = this.$route.query.id;
    this.userEmail = this.$route.query.email;
  },
  methods: {
    ...mapActions(["setUserAuthentication"]),

    async tryAgain() {
      if (this.loading) return;
      this.loading = true;
      let utilisateur;
      try {
        const { data } = await axios.post(
          `${URL_backend}/authentification/checkToken`,
          { email: this.userEmail }
        );
        utilisateur = data;
        utilisateur.verificationStatus
          ? this.$router.push({ path: "/login" })
          : window.location.reload();
      } catch (error) {
        this.codeVerificationMessage =
          error?.response?.data?.error || "Une erreur est survenue.";
      } finally {
        this.loading = false;
      }
    },

    async verifyRegsToken() {
      this.loading = true;
      this.registerToken = this.otpCode.join(""); // Combiner les chiffres en un seul code

      try {
        const dataUser = { id: this.userId, registerToken: this.registerToken };
        const utilisateurRes = await axios.post(
          `${URL_backend}/authentification/verificationToken`,
          dataUser
        );

        if (utilisateurRes) {
          const dataUser = { id: this.userId };
          await axios.post(
            `${URL_backend}/authentification/resetToken`,
            dataUser
          );
          const res = await axios.get(`${URL_backend}/utilisateurs/me`, {
            headers: { "x-auth-token": String(utilisateurRes.data) },
          });
          this.idRole = res.data.role;

          const roleRes = await axios.get(`${URL_backend}/role/${this.idRole}`);
          let data = {
            connection: true,
            role: roleRes.data.nom,
            Token: String(utilisateurRes.data),
          };
          this.setUserAuthentication(data);
          this.$router.push({ path: "/ProfilePage" });
        }
      } catch (error) {
        this.codeVerificationMessage =
          error.response.data.error || "Une erreur est survenue.";
      } finally {
        this.loading = false;
      }
    },
    onlyNumber(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault(); // Annule l'entrée si ce n'est pas un chiffre
      }
    },

    moveToNext(index, event) {
      if (event.target.value && index < this.otpCode.length - 1) {
        this.$refs[`otp${index + 1}`][0]?.focus();
      }
    },

    moveToPrevious(index, event) {
      if (event.key === "Backspace" && index) {
        this.$set(this.otpCode, index, "");
        this.$refs[`otp${index - 1}`]?.[0].focus();
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url("../../../src/assets/images/background signup.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.register {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-wrapper {
  padding: 30px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.title {
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  color: #ffffff;
  font-weight: 500;
}

.otp-input-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;
}

.otp-input {
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  color: #009176;
}

.modern-button {
  background: linear-gradient(135deg, #9afb6e, #77dee3);
  color: #fff;
  font-size: 16px;
  padding: 10px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);
}

.modern-button:hover {
  background: linear-gradient(135deg, #77dee3, #9afb6e);
}
</style>
