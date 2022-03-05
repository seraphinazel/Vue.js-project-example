<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'cart'}" class="breadcrumbs__link">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'order'}" class="breadcrumbs__link">
            Оформление заказа
          </router-link>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
    </div>
    <div class="loader" v-if="orderSending">
      <div class="l_main">
        <div class="l_square"><span></span><span></span><span></span></div>
        <div class="l_square"><span></span><span></span><span></span></div>
        <div class="l_square"><span></span><span></span><span></span></div>
        <div class="l_square"><span></span><span></span><span></span></div>
      </div>
    </div>

    <section class="cart" v-else>
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText title="ФИО" :error="formError.name" placeholder="Введите ваше полное имя" v-model="formData.name"/>

            <BaseFormText title="Адрес доставки" :error="formError.address" placeholder="Введите ваш адрес" v-model="formData.address"/>

            <BaseFormText title="Телефон" :error="formError.phone" placeholder="Введите ваш телефон" v-model="formData.phone" type="tel"/>

            <BaseFormText title="Email" :error="formError.email" placeholder="Введи ваш Email" v-model="formData.email" type="email"/>

            <BaseFormTextarea title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания" v-model="formData.comment"/>

            <button class="button mystyle button--primery" type="reset" @click.prevent="resetForm">
              Очистить форму
            </button>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <p style="color: red;" v-if="formError.deliveryTypeId">Необходимо выбрать способ доставки!</p>
            <ul class="cart__options options">
              <li class="options__item" v-for="delivery in deliveriesData" :key="delivery.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="delivery.id" v-model="formData.deliveryTypeId" @click="loadPayments">
                  <span class="options__value">
                    {{ delivery.title }} <b> {{ delivery.price | numberFormat }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <p style="color: red;" v-if="formError.paymentTypeId">Необходимо выбрать способ оплаты!</p>
            <ul class="cart__options options">
              <li class="options__item" v-for="payment in paymentsData" :key="payment.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="payment.id" v-model="formData.paymentTypeId">
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in products" :key="item.id">
              <h3>{{ item.product.title }}</h3>
              <p class="product__info product__info--color">
                <span>
                  <i :style="{'background-color': item.color.color.code}" class="colors__value mystyle"></i>
                    {{ item.color.color.title }}
                </span>
              </p>
              <p>
                Размер: {{ item.size.title }}
              </p>
              <b>{{ item.product.price | numberFormat }} ₽ х {{ item.quantity }}</b>
              <span>Артикул: {{ item.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b> {{ deliveryPrice | numberFormat}} ₽</b></p>
            <p>Итого: <b>{{ totalAmount }}</b> шт. товаров на сумму <b>{{ totalPrice | numberFormat }} ₽</b></p>
            <p>Итого с учетом доставки: <b>{{ +totalPrice + deliveryPrice | numberFormat }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import { API_BASE_URL } from '../config';

export default {
  components: { BaseFormText, BaseFormTextarea },
  filters: { numberFormat },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      orderSending: false,
      deliveriesData: [],
      paymentsData: [],
      deliveryPrice: 0,
    };
  },
  computed: {
    ...mapGetters({ totalPrice: 'cartTotalPrice', totalAmount: 'cartTotalAmount' }),
    products() {
      return this.$store.state.cartProducts;
    },
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.orderSending = true;
      clearTimeout(this.orderSendingTimer);
      this.orderSendingTimer = setTimeout(() => {
        axios
          .post(`${API_BASE_URL}/api/orders`, {
            ...this.formData,
          }, {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          })
          .then((response) => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
          })
          .catch((error) => {
            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message;
          })
          .then(() => {
            this.orderSending = false;
          });
      }, 5000);
    },
    loadDeliveries() {
      axios.get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => { this.deliveriesData = response.data; });
    },
    loadPayments() {
      clearTimeout(this.paymentLoader);
      this.paymentLoader = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: this.formData.deliveryTypeId,
          },
        })
        .then((response) => { this.paymentsData = response.data; })
        .then(() => {
          this.updateDeliveryPrice(this.formData.deliveryTypeId);
        });
      }, 0);
    },
    resetForm() {
      this.formData = [];
      this.formError = [];
    },
    updateDeliveryPrice(currentId) {
      const deliveryItem = this.deliveriesData.find((item) => item.id === currentId);
      this.deliveryPrice = +deliveryItem.price;
    },
  },
  created() {
    this.loadDeliveries();
  },
};
</script>
