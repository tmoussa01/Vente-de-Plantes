<template>
  <div class="container wid">
    <div class="row">
      <nav aria-label="Page navigation  ">
        <ul class="pagination">
          <li class="page-item">
            <button class="page-link" @click="pagePrecedentSuivent(false)">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </button>
          </li>

          <li v-for="(Page, idx) in PageListe" :key="idx" class="page-item">
            <button
              :class="PageSelection === Page ? 'page-link active' : 'page-link'"
              @click="changePage(Page)"
            >
              {{ Page }}
            </button>
          </li>

          <li class="page-item">
            <button @click="pagePrecedentSuivent(true)" class="page-link">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "PaginationStore",
  data() {
    return {
      PageSelection: "",
      PageListe: [],
    };
  },
  props: ["ComponentName"],
  computed: {
    ...mapGetters([
      "TousLesUtilisateurs",
      "toutesLesCategorie",
      "toutesLesFormat",
      "tousLesPlantes",
    ]),
  },
  mounted() {
    if (!this.$route.query.page) {
      this.$router
        .push({
          path: "/",
          name: "Admin",
          query: {
            page: 1,
          },
        })
        .catch(() => {});
    }
    this.PageSelection = parseInt(this.$route.query.page);
    this.pagination();
  },
  methods: {
    ...mapActions([
      "GetUsByPNum",
      "GetCatNumPage",
      "GetFormNumPage",
      "GetPlanteByNumPage",
    ]),
    pagination() {
      this.PageListe = [];
      let Scale = this.PageSelection + 3;
      for (let index = this.PageSelection; index < Scale; index++) {
        console.log("index", index);
        this.PageListe.push(index);
      }
      console.log(this.PageListe);
    },
    changePage(page) {
      console.log("page", page);
      if (this.ComponentName == "utilisateurComponent") {
        this.GetUsByPNum(page);
        console.log("this.TousLesUtilisateurs", this.TousLesUtilisateurs);
        let newData = this.TousLesUtilisateurs;
        this.$emit("new-UserData", newData, page);
      }
      if (this.ComponentName == "categorieComponent") {
        this.GetCatNumPage(page);
        let newd = this.toutesLesCategorie;
        this.$emit("new-CategorieData", newd, page);
      }
      if (this.ComponentName == "formatComponent") {
        this.GetFormNumPage(page);
        let newd = this.toutesLesFormat;
        this.$emit("new-FormatData", newd, page);
      }
      if (this.ComponentName == "PlanteComponent") {
        this.GetPlanteByNumPage(page);
        let newd = this.tousLesPlantes;
        this.$emit("new-PlantesData", newd, page);
      }
      this.PageSelection = page;
      this.$router
        .push({
          path: "/",
          name: "Admin",
          query: {
            page: page,
          },
        })
        .catch(() => {});
    },
    pagePrecedentSuivent(elem) {
      console.log("PageSelection", this.PageSelection);
      if (this.PageSelection == 1 && elem == false) {
        console.log("non");
      }
      if (this.PageSelection !== 1 && elem == false) {
        console.log("aaaaaaa", this.PageSelection);
        this.PageSelection = this.PageSelection - 1;
        this.changePage(this.PageSelection);
        this.pagination();
        console.log("nn", this.PageSelection);
      }
      if (elem == true) {
        this.PageSelection = this.PageSelection + 1;
        this.changePage(this.PageSelection);
        this.pagination();
      }
    },
  },
};
</script>


<style scoped>
.wid {
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}
</style>







