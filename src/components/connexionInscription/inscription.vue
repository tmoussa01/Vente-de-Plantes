<template>
  <div class="signup-container">
    <section class="contact-form pt-4">
      <div class="container">
        <div class="row mt-12">
          <div class="col-md-6 mx-auto register">
            <div class="form-wrapper">
              <div class="text-center mb-4">
                <h4 class="title">Inscription</h4>
              </div>
              <form>
                <div class="row">
                  <div
                    v-if="erreurSignup !== ''"
                    class="alert alert-danger"
                    role="alert"
                  >
                    {{ erreurSignup }}
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="text"
                        v-model="inscriptionData.nom"
                        ref="nomCase"
                        class="form-control modern-input"
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="text"
                        v-model="inscriptionData.prenom"
                        class="form-control modern-input"
                        placeholder="Prénom"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="email"
                        v-model="inscriptionData.email"
                        class="form-control modern-input"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div class="col-md-6"></div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="password"
                        v-model="inscriptionData.password"
                        class="form-control modern-input"
                        placeholder="Mot de passe"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="password"
                        v-model="inscriptionData.confirmPassword"
                        class="form-control modern-input"
                        placeholder="Confirmez mot de passe"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="date"
                        v-model="inscriptionData.dateNaissance"
                        class="form-control modern-input"
                      />
                    </div>
                  </div>
                </div>
                <div class="text-center mt-3">
                  <button
                    @click="inscription($event)"
                    class="btn modern-button"
                  >
                    S'inscrire
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script >
//<script lang="ts">
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;

export default {
  name: "ConnexionInscription",
  data: () => ({
    inscriptionData: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateNaissance: [],
    },
    connexionData: {
      email: "",
      password: "",
    },
    erreurLogin: false,
    erreurSignup: "",
  }),
  mounted() {
    this.$refs.nomCase.focus();
  },

  methods: {
    async inscription(event) {
      event.preventDefault();

      const { nom, prenom, email, password, confirmPassword, dateNaissance } =
        this.inscriptionData;

      if (!password || !confirmPassword) {
        this.erreurSignup =
          "Les champs de mot de passe ne peuvent pas être vides.";
        return;
      }

      if (password !== confirmPassword) {
        this.erreurSignup = "Les mots de passe ne sont pas identiques.";
        this.inscriptionData.confirmPassword = "";
        this.inscriptionData.password = "";
        return;
      }

      try {
        const response = await axios.post(
          `${URL_backend}/authentification/signup`,
          {
            nom,
            prenom,
            email,
            password,
            dateNaissance,
          }
        );

        this.connexionData.email = email;
        this.connexionData.password = password;
        this.erreurSignup = "";

        this.$router.push({
          path: "/verification",
          query: { email, id: response.data._id },
        });
      } catch (error) {
        this.erreurSignup =
          error.response?.data ||
          "Erreur de connexion au serveur. Veuillez vérifier votre connexion réseau.";
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

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.modern-input {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #009176;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.modern-input:focus {
  border-color: #a777e3;
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.4);
  outline: none;
}

.alert {
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
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
.alert.alert-danger {
  backdrop-filter: blur(10px);
  background: rgba(255, 0, 0, 0.25);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #682626;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  font-size: 14px;
}
.login {
  width: 100%;
  max-width: 500px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Form-wrapper commun */
.form-wrapper {
  padding: 30px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>