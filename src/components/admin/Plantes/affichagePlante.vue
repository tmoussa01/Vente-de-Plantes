<template>
  <div>
    <div>
      <AjouterPlante v-on:NewData="RestData" key="AjouterPlante" />

      <ListePlante key="ListePlante" ref="child" />
    </div>
  </div>
</template>

<script>
import AjouterPlante from "./ajouterPlante.vue";
import ListePlante from "./listePlante.vue";

export default {
  name: "AffichagePlante",
  components: {
    AjouterPlante,
    ListePlante,
  },
  methods: {
    RestData() {
      console.log("page plante");
      this.$refs.child.getListePLanteStore();
    },
  },
};
</script>