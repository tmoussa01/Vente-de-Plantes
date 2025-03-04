<template>
  <div class="d-flex justify-content-end">
    <input
      class="form-control"
      type="search"
      placeholder="Rechercher une plante"
      aria-label="Search"
      v-model="dataRecherche"
    />
    <div class="input-group-append">
      <button @click="recherche($event)" class="btn btn-outline-success">
        <i class="fas fa-search search-icon"></i>
      </button>
    </div>
  </div>
</template>


<script>
export default {
  name: "RechercheBarre",
  data() {
    return {
      dataRecherche: "",
    };
  },
  methods: {
    recherche(event) {
      event.preventDefault();
      this.$router
        .push({
          path: "/RecherchePage",
          name: "RecherchePage",
          query: {
            dataRech: this.dataRecherche,
          },
        })
        .catch(() => {});
      this.dataRecherche = "";
    },
  },
};
</script>
<style scoped>
.search-icon {
  color: black;
}
</style>