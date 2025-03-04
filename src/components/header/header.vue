<template>
  <div>
    <nav
      class="navbar navbar-expand-lg navbar-light fixed-top"
      style="background: rgb(25, 135, 84); backdrop-filter: blur(10px)"
    >
      <div class="container">
        <div class="navbar-header">
          <router-link to="/" class="navbar-brand ml-auto">
            <img :src="companyLogo" alt="Succulent" />
          </router-link>
        </div>
        <button
          @click="isActive = !isActive"
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          :class="[
            isActive
              ? 'collapse navbar-collapse show'
              : 'collapse navbar-collapse',
          ]"
        >
          <ul class="navbar-nav ml-auto">
            <li class="nav-item" v-if="!auth.userLogin">
              <router-link
                to="/ConnexionInscription"
                class="btn btn-outline-primary mx-2"
              >
                Connexion
              </router-link>
            </li>
            <li class="nav-item" v-if="auth.userLogin">
              <button
                class="btn btn-outline-danger mx-2"
                @mouseover="changeButtonColor(true)"
                @mouseout="changeButtonColor(false)"
                @click="LogOutUser"
              >
                Déconnexion
              </button>
            </li>
            <li class="nav-item">
              <router-link to="/Panier" class="btn btn-outline-warning mx-2">
                Panier
              </router-link>
            </li>
            <li class="nav-item" v-if="auth.userLogin">
              <router-link to="/WishList" class="btn btn-outline-warning mx-2">
                WishList
              </router-link>
            </li>
            <li class="nav-item" v-if="auth.role === 'admin'">
              <router-link to="/Admin" class="btn btn-outline-danger mx-2">
                Admin
              </router-link>
            </li>
            <li class="nav-item" v-if="auth.userLogin">
              <router-link
                to="/ProfilePage"
                class="btn btn-outline-warning mx-2"
              >
                Profile
              </router-link>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <Recherche />
          </form>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Recherche from "./recherche.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "HeaderBar",
  components: { Recherche },
  data() {
    return {
      isActive: false,
      auth: { userLogin: false, role: "" },
      companyLogo: "",
      buttonHovered: false,
    };
  },
  computed: {
    ...mapGetters(["UserAuthentification"]),
  },
  created() {
    this.getDataUtilisateur();
    this.$store.watch((state) => {
      console.log("storeChange", state);
      this.StoreDataChange(state);
    });
  },

  methods: {
    ...mapActions(["getUserAuthentication", "setUserAuthentication"]),
    changeButtonColor(isHovered) {
      this.buttonHovered = isHovered;
    },
    getDataUtilisateur() {
      this.getUserAuthentication();
      console.log("ddddddddd", this.UserAuthentification);
      this.auth.userLogin = this.UserAuthentification.connection;
      this.auth.role = this.UserAuthentification.role;
      console.log("auth", this.auth);
    },
    LogOutUser() {
      console.log("hhhhhhhhhhhh");
      let data = { connection: false, role: null };
      this.auth = { userLogin: false, role: null };
      this.setUserAuthentication(data);
      this.$router.push({ path: "/" });
    },
    StoreDataChange(state) {
      console.log("mmmmmmmmmm", state.Authentification.authentification);
      let data = state.Authentification.authentification;
      this.auth = { userLogin: data.connection, role: data.role };
    },
  },
};
</script>

<style scoped>
.navbar {
  border-bottom: 2px solid #388e3c;
}

.navbar-toggler-icon {
  background-color: #fff;
}

.navbar-toggler {
  border: none;
}

.nav-link,
.btn {
  font-size: 18px;
  margin: 0 10px;
  color: #fff;
}

.btn-outline-danger:hover,
.btn-outline-danger:focus {
  color: #fff;
  background-color: #d32f2f;
  border-color: #d32f2f;
}

.btn-success {
  background-color: #4caf50;
  border-color: #4caf50;
}

.btn-success:hover,
.btn-success:focus {
  background-color: #388e3c;
  border-color: #388e3c;
}
</style>
  