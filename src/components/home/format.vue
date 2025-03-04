<template>
  <div>
    <h2 class="font-weight-bold">Liste Format :</h2>
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="elem in listFormat" :key="elem._id">
        <!-- Default checked -->
        <div class="custom-control custom-checkbox" style="text-align: left">
          <input
            @change="toggleCheckFormatbox(elem)"
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
  name: "FormatPlante",
  data() {
    return {
      listFormat: [],
    };
  },
  computed: {
    ...mapGetters(["toutesLesFormat"]),
  },
  created() {
    this.GetFormats();
    this.$store.watch(() => {
      this.getListeFormat();
    });
  },
  mounted() {
    this.listFormat = this.toutesLesFormat;
    console.log("yyyyyyy", this.listFormat);
  },
  methods: {
    ...mapActions(["GetFormats"]),
    toggleCheckFormatbox(format) {
      this.$emit("toggleCheckFormatbox", format);
    },
    getListeFormat() {
      this.listFormat = this.toutesLesFormat;
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
