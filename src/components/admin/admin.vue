<template>
  <div>
    <!-- <h1>Admin</h1> -->
    <center>
      <div class="container">
        <div class="row">
          <div class="col-md-3 df">
            <div class="list-group">
              <a
                @click="ChangePage('Utilisateurs')"
                :class="ChangeClassComponent('Utilisateurs') ? 'active' : ''"
                class="list-group-item list-group-item-action v"
              >
                Utilisateurs
              </a>
              <a
                @click="ChangePage('Categories')"
                :class="ChangeClassComponent('Categories') ? 'active' : ''"
                class="list-group-item list-group-item-action v"
              >
                Categories
              </a>
              <a
                @click="ChangePage('Formats')"
                :class="ChangeClassComponent('Formats') ? 'active' : ''"
                class="list-group-item list-group-item-action v"
              >
                Formats
              </a>
              <a
                @click="ChangePage('AffichagePlante')"
                :class="ChangeClassComponent('AffichagePlante') ? 'active' : ''"
                class="list-group-item list-group-item-action v"
              >
                Plante
              </a>
              <a class="list-group-item list-group-item-action v"> Commande </a>
            </div>
          </div>
          <div class="col-md-9">
            <Utilisateurs
              key="Utilisateurs"
              v-if="ChangeClassComponent('Utilisateurs')"
            />
            <Categories
              key="Categories"
              v-if="ChangeClassComponent('Categories')"
            />
            <Formats key="Formats" v-if="ChangeClassComponent('Formats')" />
            <AffichagePlante
              key="AffichagePlante"
              v-if="ChangeClassComponent('AffichagePlante')"
            />
          </div>
        </div>
      </div>
    </center>
  </div>
</template>

<script>
import Categories from "./categories.vue";
import Formats from "./format.vue";
import AffichagePlante from "./Plantes/affichagePlante.vue";
import Utilisateurs from "./utilisateurs.vue";
export default {
  name: "AdminPage",
  data() {
    return {
      Data: [
        { nom: "Utilisateurs", val: true },
        { nom: "Categories", val: false },
        { nom: "Formats", val: false },
        { nom: "AffichagePlante", val: false },
      ],
    };
  },
  components: {
    Categories,
    Formats,
    AffichagePlante,
    Utilisateurs,
  },
  methods: {
    ChangeClassComponent(PName) {
      for (let index = 0; index < this.Data.length; index++) {
        const element = this.Data[index];
        if (PName == element.nom) {
          return element.val;
        }
      }
    },
    ChangePage(nomPage) {
      let newData = [];
      for (let index = 0; index < this.Data.length; index++) {
        const element = this.Data[index];
        if (nomPage == element.nom) {
          element.val = !element.Val;
          newData.push(element);
        } else {
          element.val = false;
          newData.push(element);
        }
      }
      this.Data = newData;
    },
  },
};
</script>

<style>
.d {
  font-family: cursive;
  border: 1px solid #2f4f4f1f;
  margin: 1% auto;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

df {
  border: 1px solid #2f4f4f1f;
  margin: 1% auto;
}
.v {
  cursor: pointer;
}
</style>





