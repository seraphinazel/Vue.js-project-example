<template>
  <div class="item__pics pics">
    <div class="pics__wrapper">
      <img :width="width" :height="height" v-if="!colorId && baseImage" :src="baseImage" :alt="product.slug">
      <img :width="width" :height="height" v-else-if="imageOfColor" :src="imageOfColor" :alt="product.slug">
      <div :width="width" :height="height" v-else>Изображение не найдено</div>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'colorId', 'product', 'width', 'height' ],
  data() {
    return {
      baseImage: null,
      imageOfColor: null,
    };
  },
  computed: {
    currentColorGallery() {
      return this.product.colors.filter((color) => color.id === this.colorId);
    },
  },
  methods: {
    doLoadBaseImage() {
      if (this.product.colors[0].gallery) {
        this.baseImage = this.product.colors[0].gallery[0].file.url;
      }
    },
    doLoadColorImage() {
      if (this.colorId) {
        if (this.currentColorGallery[0].gallery) {
          this.imageOfColor = this.currentColorGallery[0].gallery[0].file.url;
        }
      }
    },
  },
  created() {
    this.doLoadBaseImage();
  },
  updated() {
    this.doLoadColorImage();
  },
};
</script>
