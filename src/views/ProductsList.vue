<template>
  <div class="products-list">
    <div class="filters">
      <div class="filters-availability">
        <label for="filters-availability" class="filters-availability-label">Filtrar produtos:</label>

        <select
          v-model="filtersAvailability"
          name="filters-availability" 
          class="filters-availability-select"
        >
          <option disabled value="">Escolha um filtro</option>
          <option value="all">Exibir todos os produtos</option>
          <option value="available">Exibir somente produtos em estoque</option>
        </select>
      </div>

      <div class="filters-price">
        <div class="filters-price-item">
          <input type="checkbox" v-model="filtersPrice" value="filters-price-all">
          <label for="filters-price-all">Todos os valores</label>
        </div>
        <div class="filters-price-item">
          <input type="checkbox" v-model="filtersPrice" value="filters-price-up-to-50">
          <label for="filters-price-up-to-50">Até $50</label>
        </div>
        <div class="filters-price-item">
          <input type="checkbox" v-model="filtersPrice" value="filters-price-above-100">
          <label for="filters-price-above-100">A partir de $100</label>
        </div>
      </div>
    </div>

    <div class="products">
      <div class="product" v-for="product in filteredProducts" :key="product.id">
        <div class="product-image">
          <img
            src="http://placehold.it/250"
            :alt="product.name"
          >
        </div>
        <div class="product-info">
          <span class="product-info-name">{{ product.name }}</span>
          <span class="product-info-brand">{{ getProductInfo(product) }}</span>
          <span class="product-info-price">
            {{ data.currency}}
            {{ product.price }}
          </span>
        </div>
        <div class="product-buy">
          <button
            class="product-buy-button"
            @click="addToCart(product)"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>

    <div class="cart" v-if="isCartVisible">
      <div class="cart-header">
        <span class="cart-header-text">Produto(s) adicionado(s):</span>
        <div class="cart-header-close"  @click="closeCart">
          <img src="@/assets/close.svg" alt="Fechar carrinho">
        </div>
      </div>
      <div class="cart-empty" v-if="cartIsEmpty()">
        <p class="cart-empty-title">Nenhum produto adicionado</p>
        <p class="cart-empty-text">Você ainda não adicionou nenhum produto ao carrinho. <br> Produtos adicionados aparecerão aqui.</p>
      </div>
      <vue-custom-scrollbar class="cart-scroll-area" :settings="settings">
        <div 
          class="product-added"
          v-for="(product, index) in cartData" :key="index"
        >
          <div class="product-added-image">
            <img
              src="http://placehold.it/100"
              :alt="product.name"
            >
          </div>
          <div class="product-added-info">
            <span class="product-added-info-name">{{ product.name }}</span>
            <span class="product-added-info-brand">{{ getProductInfo(product) }}</span>
            <span class="product-added-info-price">
              {{ data.currency}}
              {{ product.price }}
            </span>
          </div>
          <div
            class="product-added-remove"
            @click="removeFromCart(index)"
          >
            <img src="@/assets/trash-icon.svg" alt="Remover produto">
          </div>
        </div>
      </vue-custom-scrollbar>
      <div class="cart-footer" v-if="!cartIsEmpty()">
        <span class="cart-footer-text">Valor total: {{ cartTotal() }}</span>
        <button class="cart-footer-button">Finalizar compra</button>
      </div>
    </div>
  </div>
</template>

<script>

import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"

export default {
  name: 'ProductsList',
  props: {},
  components: {
    vueCustomScrollbar
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 100,
      },
      data: [],
      cartData: JSON.parse(localStorage.getItem('cart')) || [],
      isCartVisible: false,
      filtersAvailability: '',
      filtersPrice: []
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.data.products;
      let filteredByCheckbox = []

      if(this.filtersAvailability === 'available') {
        filtered = this.data.products.filter(p => p.hasStock);
      }

      if(this.filtersPrice.includes('filters-price-all')) {
        return filtered;
      }

      const hasUpTo50 = this.filtersPrice.includes('filters-price-up-to-50')
      const hasAbove100 = this.filtersPrice.includes('filters-price-above-100')
      if(hasUpTo50) {
        const filteredUpTo50 = filtered.filter(p => p.price <= 50)
        filteredByCheckbox.push(...filteredUpTo50);
      } 

      if(hasAbove100) {
        const filteredAbove100 = filtered.filter(p => p.price >= 100)
        filteredByCheckbox.push(...filteredAbove100);
      } 

      if(hasUpTo50 || hasAbove100) {
       return filteredByCheckbox;
      }
      return filtered
    },
  },
  methods: {
    getProductInfo(product) {
      if(product.brand === null) {
        return "-";
      } else {
        return product.brand;
      }
    },
    addToCart(product) {
      this.isCartVisible = true;
      this.cartData.push(product);
      this.storeCartData(this.cartData);
    },
    removeFromCart(index) {
      this.cartData.splice(index, 1);
      this.storeCartData(this.cartData);
    },
    storeCartData(cart) {
      const stringfyCartData = JSON.stringify(cart);
      localStorage.setItem('cart', stringfyCartData);
    },
    cartTotal() {
      let total = this.cartData.reduce((total, next) => total + next.price, 0);
      return ` ${this.data.currency} ${total} `;
    },
    cartIsEmpty() {
      if(this.cartData.length == 0) {
        return true
      }
    },
    closeCart() {
      this.isCartVisible = false;
    }
  },
  mounted() {
    const url = 'https://www.trinto.com.br/testes/frontendjr/index.php';
    fetch(url)
      .then(async (res) => {
        if (res.status === 200) {
          this.data = await res.json();
        } else if (res.status === 404) {
          console.warn(res);
        } else {
          console.warn('Ops! Algo errado aconteceu.');
        }
      })
      .catch((reason) => {
        console.warn(reason);
      });
  },
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  align-items: center;
  margin-top: 50px;
  margin-right: auto;
  padding: 20px;
  &-price {
    display: inline-flex;
    &-item {
      padding: 5px 0;
      margin: 0 10px;
      label {
        margin-left: 5px;
      }
    }
  }
  &-availability {
    &-select {
      padding: 10px;
      margin: 0 10px;
    }
  }
  @include not-desktop {
    align-items: flex-start;
    flex-direction: column;
    max-width: 100%;
    &-price {
      display: inline-block;
      &-item {
        margin: 0;
      }
    }
    &-availability {
      &-select {
        width: 100%;
        margin: 10px 0;
      }
    }
  }
}

.products {
  display: flex;
  flex-direction: row;
  max-width: 67%;
  height: calc(100vh - 199px);
  overflow-y: scroll;
  flex-wrap: wrap;
  @include not-desktop {
    justify-content: center;
    height: auto;
    margin-bottom: 70px;
    max-width: 100%;
  }
  .product {
    padding: 20px;
    &-image {
      max-height: 250px;
    }
    &-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 0;
      &-name {
        font-size: 18px;
        font-weight: 600;
        text-transform: capitalize;
        color: $purple;
      }
      &-brand {
        text-transform: capitalize;
        color: $lightgray;
        font-size: 14px;
      }
      &-price {
        font-weight: 600;
      }
    }
    &-buy {
      &-button {
        width: 100%;
      }
    }
  }
}

.cart {
  position: fixed;
  top: 50px;
  right: 0;
  width: 30vw;
  height: calc(100vh - 100px);
  background: $white;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 1px rgb(0 0 0 / 10%);
  padding: 0 20px;
  z-index: 0;
  transition: all .3s ease-in-out;
  color: $gray;
  @include not-desktop {
    width: -webkit-fill-available;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    &-text {
      font-size: 18px;
      font-weight: 600;
    }
    &-close {
      cursor: pointer;
    }
  }
  &-empty {
    padding: 40px 0;
    text-align: center;
    &-title {
      font-weight: 600;
    }
    &-text {
      color: gray;
      font-size: 14px;
    }
  }
  &-scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    height: 60%;
    .product-added {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
      padding-right: 20px;
      &-image {
        flex-grow: 1;
      }
      &-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-grow: 6;
        &-name {
          font-weight: 600;
          text-transform: capitalize;
          color: $purple;
        }
        &-brand {
          font-size: 12px;
          text-transform: capitalize;
          color: $lightgray;
        }
        &-price {
          font-size: 14px;
          font-weight: 600;
        }
      }
      &-remove {
        cursor: pointer;
      }
    }
  }
  &-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    &-text {
      padding: 0 20px;
      font-size: 18px;
      font-weight: 600;
    }
    &-button {
      position: relative;
      bottom: 0;
      width: 100%;
      left: 0;
      margin-top: 20px;
    }
  }
}

</style>
