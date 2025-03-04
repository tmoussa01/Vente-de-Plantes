<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-6 text-center">
        <div class="card border-primary">
          <div class="card-header bg-primary text-white">Payment réussi</div>
          <div class="card-body">
            <button class="btn btn-primary btn-lg" disabled>
              <span class="bi bi-check" style="font-size: 3rem"></span>
            </button>
            <h1 class="mt-4">Tout s'est bien passé</h1>
            <h6>Nous vous remercions pour votre achat</h6>
            <h6>Votre commande sera traitée dans quelques jours</h6>
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
import { mapActions } from "vuex";
export default {
  name: "successPayment",
  data() {
    return {
      order: {},
      session: {},
      validSession: false,
      adresseId: "",
      commande: "",
    };
  },
  async mounted() {
    const sessionId = this.$route.query.id;
    try {
      await axios
        .get(`${URL_backend}/commande/checkoutSessionRecup/${sessionId}`)
        .then((res) => {
          this.session = res.data;
          this.validSession = Object.keys(this.session).length != 0;
        });
    } catch (error) {
      console.log(error.response.data.error);
    }
    if (!this.validSession) return;
    const lineItems = this.session.line_items.data;
    console.log("lineItems", lineItems);
    //const shipCost = lineItems[lineItems.length - 1].amount_total;
    try {
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;
      this.adresseId = await axios.post(
        `${URL_backend}/adresse`,
        {
          rue: this.session.metadata.shippingRue,
          numero: this.session.metadata.shippingNumero,
          code_postal: this.session.metadata.shippingPostal,
          pays: this.session.metadata.shippingPays,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
    } catch (error) {
      console.log(error.response.data.error);
    }
    try {
      const shipCost = lineItems[lineItems.length - 1].amount_total;
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;
      this.commande = await axios.post(
        `${URL_backend}/commande`,
        {
          num_phone: this.session.metadata.customerPhoneNo,
          num_carte: this.session.metadata.carteNumero,
          nom_carte: this.session.metadata.carteProprio,
          montantTotal: (this.session.amount_total - shipCost) / 100,
          prixEnvoi: shipCost / 100,
          expiration_carte: this.session.metadata.cartedateExpiration,
          adresse: this.adresseId.data._id,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
    } catch (error) {
      console.log(error.response.data.error);
    }
    for (let i = 0; i < lineItems.length - 1; i++) {
      let planteId = lineItems[i].description;
      console.log("planteId", planteId);
      try {
        let token = JSON.parse(localStorage.getItem("Authentification")).Token;
        await axios.post(
          `${URL_backend}/ligne_commande`,
          {
            quantite: lineItems[i].quantity,
            Commande: this.commande.data._id,
            plante: planteId,
          },
          {
            headers: { "x-auth-token": token },
          }
        );
      } catch (error) {
        console.log(error.response.data.error);
      }
      let lineproduct;
      try {
        lineproduct = await axios.get(`${URL_backend}/plantes/${planteId}`);
      } catch (error) {
        console.log(error.response.data.error);
      }
      try {
        let token = JSON.parse(localStorage.getItem("Authentification")).Token;
        await axios.put(
          `${URL_backend}/plantes/venteQuantite/${planteId}`,
          {
            nbrVente: lineproduct.data.nbrVente + lineItems[i].quantity,
            quantite: lineproduct.data.quantite - lineItems[i].quantity,
          },
          { headers: { "x-auth-token": token } }
        );
        this.SupprimerElemDuPanier(planteId);
      } catch (error) {
        console.log(error.response.data.error);
      }
    }
  },
  methods: {
    ...mapActions(["SupprimerElemDuPanier"]),
  },
};
</script>



