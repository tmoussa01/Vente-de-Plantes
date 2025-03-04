<template>
  <div>
    <div class="p-2 mt-2 bg-light">
      <form @submit.prevent="envoiReqPassword">
        <div class="form-group mb-2 font-weight-bold">
          <label for="input-email-for-token">Entrez votre email</label>
          <input
            v-model="email"
            ref="emailField2"
            id="input-email-for-token"
            @keyup="emailEnvoye = false"
            type="email"
            class="form-control"
            required
          />
        </div>
        <small
          >Nous vous enverons un email pour rénitialiser votre mot de
          passe.</small
        ><br />
        <div v-if="tokenAlert" class="alert alert-primary my-2 p-1 pl-2">
          {{ tokenAlertMessage }}
        </div>
        <button class="btn btn-outline-dark mt-2" type="submit">Submit</button>
        <div v-if="emailEnvoye" class="card mt-3">
          <div class="card-body">
            <strong>Request accepted</strong>
            <hr class="my-1" />
            <div>
              Vérifiez votre email ,un lien a été envoyé pour rénitialiser votre
              mot de passe
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  name: "ResetPassword",

  data() {
    return {
      email: null,
      tokenAlert: null,
      emailEnvoye: false,
      tokenAlertMessage: null,
    };
  },
  methods: {
    async envoiReqPassword() {
      try {
        const dataUser = {
          email: this.email,
        };
        await axios.post(
          `${URL_backend}/authentification/restpassEmail`,
          dataUser
        );
        this.tokenAlert = false;
        this.emailEnvoye = true;
        this.email = "";
      } catch (error) {
        console.log("erro", error.response);
        this.tokenAlert = true;
        this.tokenAlertMessage = error.response.data.error;
      }
    },
  },
};
</script>