<template>
  <div>
    <div class="container mt-4">
      <div class="row">
        <div class="col text-center">
          <h3>Commandes</h3>
        </div>
      </div>
      <hr />
      <div v-if="orders != 0">
        <div class="row">
          <div class="col-1 text-center">
            <strong>ID</strong>
          </div>
          <div class="col-3">
            <strong>userID</strong>
          </div>

          <div class="col-2">
            <strong>Prix commande</strong>
          </div>
          <div class="col-3 text-center">
            <strong>Status</strong>
            <div class="dropdown ml-2">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {{ selectedTypeName }}
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" @click="selectType(anyType)">
                  {{ anyType.name }}
                </a>
                <a
                  class="dropdown-item"
                  v-for="(status, idx) in orderStatus"
                  :key="idx"
                  @click="selectType(status)"
                >
                  {{ status.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div>
        <div v-for="order in secondOrderList" :key="order.id">
          <div class="row">
            <div class="col-1 text-center">{{ order._id }}</div>
            <div class="col-3">{{ order.userID }}</div>
            <div class="col-2">
              {{ order.montantTotal + order.prixEnvoi }} €
            </div>
            <div class="col-3 text-center">
              <div class="row">
                <div class="col-7">
                  <div class="dropdown">
                    <button
                      class="btn btn-sm btn-block btn-{{ order.variant }}"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {{ order.statutCommande }}
                    </button>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a
                        class="dropdown-item"
                        v-for="(status, idx) in orderStatus"
                        :key="idx"
                        @click="updateStatus(order, status)"
                      >
                        {{ status.name }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div class="mt-5 d-flex justify-content-center" v-if="orders == 0">
        <h3>Liste vide...</h3>
      </div>
      <nav aria-label="Page navigation" v-if="orders != 0">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              @click="paginate(currentPage - 1)"
              href="#"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li
            class="page-item"
            v-for="page in pages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" @click="paginate(page)" href="#">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              @click="paginate(currentPage + 1)"
              href="#"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script>
import axios from "axios";
const port = process.env.PORT || 3000;
const URL_backend = `http://localhost:${port}/api`;
export default {
  data() {
    return {
      anyType: {
        name: "All",
        variant: "dark",
      },
      selectedTypeName: "All",
      selectedTypeVariant: "dark",
      orders: 0,
      secondOrderList: null,
      orderList: null,

      orderStatus: [
        {
          name: "Suspens",
          variant: "warning",
        },
        {
          name: "Payée",
          variant: "info",
        },
        {
          name: "Préparation",
          variant: "warning",
        },
        {
          name: "Complet",
          variant: "success",
        },
      ],
      currentPage: 1,
      perPage: 20,
    };
  },
  async mounted() {
    try {
      let token = JSON.parse(localStorage.getItem("Authentification")).Token;

      this.orderList = axios.get(`${URL_backend}/commande/All`, {
        headers: { "x-auth-token": token },
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  },
};
</script>