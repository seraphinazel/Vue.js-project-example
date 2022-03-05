<template>
  <main class="content container" v-if="productLoading">Загрузка товара...</main>
  <main class="content container" v-else-if="!productData">Не удалось загрузить товар</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" disabled>
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <ProductGallery :product="product" :colorId="colorId" width="570px" height="570px"/>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <NumberButton :amount.sync="productAmount"/>
              <b class="item__price">
                {{ product.price*productAmount | numberFormat }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ProductColors :product="product" v-model.number="colorId" :required="true"/>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="size" v-model="sizeId" required="true">
                    <option v-for="size in sizes" :key="size.id" :value="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>
            
            <button class="item__button button button--primery" type="submit" :disabled="productAddSending">
              В корзину
            </button>
            <div v-show="productAdded">Товар добавлен в корзину</div>
            <div v-show="productAddSending">Добавляем товар...</div>
            <div v-if="productAddError"> {{productAddError}} </div>
          </form>
        </div>
      </div>
      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a
            :class="activeTab === 'description'
            ? 'tabs__link tabs__link--current'
            : 'tabs__link'"
            @click.prevent="activeTab = 'description'">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a
            :class="activeTab === 'delivery'
            ? 'tabs__link tabs__link--current'
            : 'tabs__link'"
            @click.prevent="activeTab = 'delivery'">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content" v-show="activeTab==='delivery'">
          <h3>Доставка:</h3>
          <p>
            1.Курьерская доставка по Москве и Московской области – 1200 ₽<br>
            2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь<br>
          </p>
        
          <h3>Возврат:</h3>
          <p>
            Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br>
            Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в которой Вы осуществили покупку.
            БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по телефону 8 800 600 90 09<br>
          </p>
        </div>

        <div class="item__content" v-show="activeTab==='description'">
          <h3>{{ product.title }}</h3>
          <p>
            Lorem, ipsum dolor, sit amet consectetur adipisicing elit.
            Pariatur inventore reiciendis expedita dignissimos ratione fugit beatae ipsam 
            ut debitis ex!
          </p>
          <h3>{{ category.title }}</h3>
          <p>
            Lorem ipsum, dolor, sit amet consectetur adipisicing elit. Dicta, quos.
          </p>
        </div>

      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import NumberButton from '@/components/NumberButton.vue';
import ProductColors from '@/components/ProductColors.vue';
import ProductGallery from '@/components/ProductGallery.vue';
import { API_BASE_URL } from '../config';

export default {
  data() {
    return {
      productAmount: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productAdded: false,
      productAddSending: false,
      productAddError: '',
      sizeId: 0,
      colorId: 0,
      activeTab: 'description',
    };
  },
  components: { NumberButton, ProductColors, ProductGallery },
  filters: { numberFormat },
  computed: {
    product() {
      return this.productData;
    },
    category() {
      return this.productData.category;
    },
    sizes() {
      return this.productData.sizes;
    },
    currentColorId() {
      if (!this.colorId) {
        return this.product.colors[0].color.id;
      } else {
        return this.product.colors.find(color => color.id === this.colorId).color.id;
      }
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.productAddError = '';
      this.addProductToCart({ productId: this.product.id, quantity: this.productAmount, colorId: this.currentColorId, sizeId: this.sizeId })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        })
        .catch((error) => {
          this.productAddError = error;
        });
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((response) => {
          this.productData = response.data;
          this.sizeId = response.data.sizes[0].id;
        })
        .catch(() => { this.productLoadingFailed = true; })
        .then(() => { this.productLoading = false; });
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>