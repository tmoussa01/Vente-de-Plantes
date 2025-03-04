<template>
  <div class="login-container">
    <section class="contact-form pt-4">
      <div class="container">
        <div class="row mt-12">
          <div class="col-md-6 mx-auto login">
            <div class="form-wrapper">
              <div class="text-center mb-4">
                <h4 class="title">Connexion</h4>
              </div>
              <form @submit.prevent="connexion">
                <div class="row">
                  <div
                    v-if="erreurLogin"
                    class="alert alert-danger"
                    role="alert"
                  >
                    {{ erreurLog }}
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="email"
                        v-model="connexionData.email"
                        ref="emailField"
                        class="form-control modern-input"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="password"
                        v-model="connexionData.password"
                        class="form-control modern-input"
                        placeholder="Mot de passe"
                      />
                    </div>
                  </div>
                </div>
                <div class="text-center mt-3">
                  <button @click="connexion" class="btn modern-button">
                    Se connecter
                  </button>
                </div>
                <div class="mt-2 text-center">
                  <small @click="toggleResetPassword"
                    >Mot de passe oublié ?</small
                  >
                </div>
                <div v-if="showResetPassword">
                  <ResetPassword />
                </div>
                <div class="text-center mt-3">
                  <router-link to="/Inscription" class="btn modern-button">
                    Créer un compte
                  </router-link>
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
import { mapActions, mapGetters } from "vuex";
import ResetPassword from "./resetPassword";
export default {
  name: "ConnexionInscription",
  components: {
    ResetPassword,
  },
  data() {
    return {
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
      erreurLog: "",
      showResetPassword: false,
      idRole: "",
    };
  },
  computed: {
    ...mapGetters(["UserAuthentification"]),
  },
  mounted() {
    this.$refs.emailField.focus();
  },
  methods: {
    ...mapActions(["setUserAuthentication"]),
    toggleResetPassword() {
      this.showResetPassword = !this.showResetPassword;
    },

    connexion() {
      const { email, password } = this.connexionData;
      axios
        .post(`${URL_backend}/authentification`, { email, password })
        .then(this.getDataUtilisateur)
        .catch((err) => {
          this.erreurLogin = true;
          this.erreurLog = err.response.data;
        });
    },
    async getDataUtilisateur({ data: token }) {
      const { data: user } = await axios.get(`${URL_backend}/utilisateurs/me`, {
        headers: { "x-auth-token": token },
      });

      const { data: role } = await axios.get(
        `${URL_backend}/role/${user.role}`
      );

      const userData = {
        connection: true,
        role: role.nom,
        Token: token,
      };

      this.setUserAuthentication(userData);
      this.$router.push({ path: "/ProfilePage" });
    },
  },
};
</script>


<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url("../../../src/assets/images/background signup.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
.modern-button {
  border-radius: 8px;
}

.modern-button {
  background: linear-gradient(135deg, #9afb6e, #77dee3);
  color: #fff;
  padding: 10px 30px;
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);
  transition: background 0.3s ease;
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
</style>