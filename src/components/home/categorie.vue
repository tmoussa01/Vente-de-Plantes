<template>
  <div>
    <h2 class="font-weight-bold">Liste Famille :</h2>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item"
        v-for="elem in listeCategories"
        :key="elem._id"
      >
        <!-- Default checked -->
        <div class="custom-control custom-checkbox" style="text-align: left">
          <input
            @change="toggleCheckCatbox(elem)"
            :id="elem._id"
            type="checkbox"
            class="custom-control-input"
          />
          <label :for="elem._id" class="custom-control-label">{{
            elem.nom
          }}</label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CategoriePlante",
  data() {
    return {
      listeCategories: [],
    };
  },
  computed: {
    ...mapGetters(["toutesLesCategorie"]),
  },
  created() {
    this.GetCategories();
    this.$store.watch(() => {
      this.getListeCategorie();
    });
  },
  mounted() {
    this.listeCategories = this.toutesLesCategorie;
    console.log("yyyyyyy", this.listeCategories);
  },
  methods: {
    ...mapActions(["GetCategories"]),
    toggleCheckCatbox(category) {
      this.$emit("toggleCheckCatbox", category);
    },
    getListeCategorie() {
      this.listeCategories = this.toutesLesCategorie;
    },
  },
};
</script>

<style scoped>
.h2,
h2 {
  font-size: 2rem;
  color: #337c24;
}
.list-group-item {
  color: #1c7b14;
}
.act + .custom-control-label::before {
  background-color: green;
  border-color: green;
}
</style>
