<template>
  <div class="text-center">
    <h5 class="btn-danger">Utilisateurs</h5>

    <ul class="list-group m">
      <li v-for="data in UsersList" :key="data._id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <img class="userimg" :src="data.img_profile" alt="" />
          <span>{{ GetRoleById(data.role) }}</span>
          {{ data.nom + " " + data.prenom }}
          <div class="form-group col-md-4">
            <label for="inputCategories">Role</label>
            <select
              @change="ChangeUserRole($event, data._id)"
              class="form-control"
            >
              <option
                v-for="roleData in RoleList"
                :key="roleData._id"
                :value="roleData._id"
              >
                {{ roleData.nom }}
              </option>
            </select>
          </div>
          <button
            @click="saveData($event, data._id, data)"
            class="btn btn-primary"
          >
            Sauvegarder
          </button>
        </div>
      </li>
    </ul>
    <PaginationStore
      ComponentName="utilisateurComponent"
      v-on:new-UserData="NewDataUtilisateur"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PaginationStore from "./paginationStore";

export default {
  name: "UtilisateursPage",
  data() {
    return {
      UsersList: [],
      RoleList: [],
      PageNumber: null,
    };
  },
  components: {
    PaginationStore,
  },
  computed: {
    ...mapGetters(["TousLesUtilisateurs", "TousLesRoles"]),
  },
  mounted() {
    this.GetRoleListFromStore();
  },
  created() {
    this.GetRoles();
    this.GetUserList();

    this.$store.watch((state) => {
      console.log("storechange", state);
      this.GetListUtilisateurStore();
      if (this.TousLesRoles.length > 0) {
        console.log("dans condition  if ", this.TousLesRoles.length);
        this.GetRoleListFromStore();
      }
    });
  },
  methods: {
    ...mapActions(["GetUserList", "ModifUtilisateur", "GetRoles"]),
    GetRoleListFromStore() {
      this.RoleList = this.TousLesRoles;
      console.log("this.TousLesRoles", this.TousLesRoles);
    },

    GetListUtilisateurStore() {
      this.UsersList = this.TousLesUtilisateurs;
      console.log("userlist3", this.UsersList);
    },
    GetRoleById(RoleID) {
      console.log("roleList", this.RoleList);
      let elem = this.RoleList.find((elem) => elem._id == RoleID);
      let nomElem = elem.nom;
      return nomElem;
    },
    roleChecking(RoleId, UserID) {
      let data = this.UsersList.find((data) => data._id == UserID);
      if (RoleId === data.role) {
        return true;
      } else {
        return false;
      }
    },
    ChangeUserRole(e, RoleID) {
      let newData = [];
      for (let index = 0; index < this.UsersList.length; index++) {
        let element = this.UsersList[index];
        if (element._id === RoleID) {
          element.role = e.target.value;
          newData.push(element);
        } else {
          newData.push(element);
        }
      }
      this.UsersList = newData;
    },
    saveData(e, UserID, newData) {
      console.log("saveData", UserID);
      e.preventDefault();
      let data = {
        id: UserID,

        role: newData.role,
      };

      this.ModifUtilisateur(data);
    },
    NewDataUtilisateur(data, page) {
      this.PageNumber = page;
      this.UsersList = data;
    },
  },
};
</script>

<style  scoped>
.userimg {
  max-width: 10%;
  border-radius: 50%;
}
.m {
  margin: 10px auto;
}

.wid {
  margin-left: auto;
  margin-right: auto;
  width: 10em;
}
</style>











