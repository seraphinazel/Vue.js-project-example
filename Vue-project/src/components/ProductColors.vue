<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="productColor in productColors" :key="productColor.id">
      <label class="colors__label">
        <input class="colors__radio sr-only" :required="required" :name="colorsRadio" type="radio" :value="productColor.id" :checked="productColor.id === productColors[0].id" @input="$emit('input', $event.target.value)">
        <span class="colors__value mystyle" :style="{'background-color': productColor.color.code}">
        </span>
      </label>
    </li>
  </ul>
</template>

<script>

export default {
  props: ['product', 'value', 'required'],
  computed: {
    productColors() {
      return this.product.colors;
    },
    colorsRadio() {
      return `color${this.product.id}`;
    },
  },
};
</script>
