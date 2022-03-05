<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <ProductGallery :product="product" :colorId="colorId" width="270px" height="350px"/>
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.price | numberFormat }} ₽
    </span>
    <ProductColors :product="product" v-model.number="colorId" :required="false"/>
  </li>
</template>

<script>
import ProductColors from '@/components/ProductColors.vue';
import ProductGallery from '@/components/ProductGallery.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  components: { ProductColors, ProductGallery },
  data() {
    return {
      colorId: 0,
    };
  },
  filters: {
    numberFormat,
  },
  props: ['product'],
};
</script>
