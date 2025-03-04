<template>
  <div>
    <center>
      <h3 class="suggestion" v-if="suggestionData.length > 0">
        Intéressant pour vous
      </h3>
    </center>
    <div class="container">
      <div class="row" v-if="isLoaded">
        <div class="col" v-for="data in suggestionData" :key="data._id">
          <div class="card">
            <img class="card-img-top" :src="data.plante_img" />
            <div class="card-block">
              <router-link
                :to="{ path: '/PlanteDescription', query: { ID: data._id } }"
                class="card-title vx"
              >
                <template #default="{ navigate }">
                  <h6 @click="navigate" class="card-title vx">
                    {{ tailleMaxNom(data.nom) }}
                  </h6>
                </template>
              </router-link>
              <p class="card-text">Prix : {{ data.prix }}€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script >
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  //   name: "SuggestionPlante",
  data() {
    return {
      suggestionData: [],
      isLoaded: Boolean,
    };
  },
  async created() {
    let list = [];

    if (localStorage.getItem("Authentification") !== null) {
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;

      if (token) {
        await axios
          .get(`${URL_backend}/machine_learning/All`, {
            headers: { "x-auth-token": token },
          })
          .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              const elem = res.data[i];

              list.push(elem);
            }
          });
      }
    }

    if (list.length > 4) {
      this.suggestionData = list.sort(() => 0.5 - Math.random()).slice(0, 5);
      this.isLoaded = true;
    } else {
      this.suggestionData = list;

      this.isLoaded = true;
    }
  },
  methods: {
    tailleMaxNom(res) {
      if (res.lenght > 8) return res;
      return res.substr(0, 8) + "...";
    },
  },
};
</script>

  
  
  <style scoped>
.card {
  width: 10rem;
  padding: 20px;
}

.card > img {
  height: 100px;
  width: 100px;
}

.col {
  margin: 1%;
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}

.vx:hover {
  cursor: pointer;
  color: darkred;
}

.suggestion {
  background: #b0eaab59;
  padding: 3px;
  font-weight: bold;
}
</style>
  