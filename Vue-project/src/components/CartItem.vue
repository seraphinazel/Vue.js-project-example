<template>
  <li class="cart__item product">

    <div class="product__pic">
      <img :src="item.productImage" width="120" height="120" :alt="item.product.title">
    </div>

    <h3 class="product__title">
      {{ item.product.title }}
    </h3>

    <p class="product__info product__info--color">
      Цвет: 
      <span>
        <i :style="{'background-color': item.productColorCode}" class="colors__value mystyle"></i>
          {{ item.productColorTitle }}
      </span>
    </p>

    <span class="product__code">
      Размер: {{ item.size.title }} <br> Артикул: {{ item.product.id }}
    </span>

    <NumberButton :amount.sync="amount"/>

    <b class="product__price">
      {{ item.price * item.quantity | numberFormat }} ₽
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteProduct()">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>

  </li>
</template>

<script>
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import NumberButton from '@/components/NumberButton.vue';

export default {
  props: ['item'],
  filters: { numberFormat },
  components: { NumberButton },
  computed: {
    amount: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', { basketItemId: this.item.id, quantity: value });
      },
    },
  },
  methods: {
    ...mapActions(['deleteCartProduct']),
    deleteProduct() {
      this.deleteCartProduct({ basketItemId: this.item.basketItemId });
    },
  },
};
</script>
