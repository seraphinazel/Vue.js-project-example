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
          <a class="breadcrumbs__link">
            Информация о заказе
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за выбор нашего магазина. На Вашу почту придет письмо с деталями заказа.
            Наши менеджеры свяжутся с Вами в течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" style="border: 1px dotted grey; padding: 10px" v-for="item in orderProducts" :key="item.id">
              <h3>{{ item.product.title }}</h3>
              <b>{{ item.product.price | numberFormat }} ₽ x {{ item.quantity }} шт. = {{ item.price*item.quantity | numberFormat }} ₽</b>
              <p>
                Артикул: {{ item.product.id }} <br>
                Размер: {{ item.size.title }} <br>
                Цвет: <i :style="{'background-color': item.color.color.code}" class="colors__value mystyle cart"></i>
                {{ item.color.color.title }}
              </p>
            </li>
          </ul>
          <div class="cart__total">
            <p>{{ orderInfo.deliveryTitle }} <b>{{ orderInfo.deliveryPrice | numberFormat }} ₽</b></p>
            <p>Итого с учетом доставки: <b>{{ orderInfo.totalPrice | numberFormat }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  filters: { numberFormat },
  computed: {
    orderInfo() {
      return this.$store.state.orderInfo;
    },
    orderProducts() {
      return this.$store.state.orderInfo.basket.items;
    },
    orderTotalQuantity() {
      return this.$store.state.orderInfo.basket.items.reduce((acc, item) => item.quantity + acc, 0);
    },
  },
  created() {
    if (this.$store.state.orderInfo && +this.$store.state.orderInfo.id === +this.$route.params.id) {
      return;
    }
    this.$store.dispatch('loadOrderInfo', +this.$route.params.id);
  },
};
</script>
