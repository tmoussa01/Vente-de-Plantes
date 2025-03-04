<template>
  <div id="app">
    <Header />

    <router-view />
  </div>
</template>

<script>
import Header from "./components/header/header.vue";
import { mapActions } from "vuex";
export default {
  name: "App",
  components: { Header },
  computed: {},
  created() {
    this.GetElemPanier();
  },
  methods: {
    ...mapActions(["GetElemPanier"]),
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
