<template>
<div>
  <header class="header container">
    <div class="header__wrapper">
      <span class="header__info">{{ headerInfo }}</span>

      <router-link class="header__logo" :to="{name: 'main'}">
        <img src="img/svg/logo-moire.svg" alt="Логотип интернет магазина Moire" width="116" height="34">
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09">
        8 800 600 90 09
      </a>

      <div v-if="cartLoading">загрузка...</div>
      <CartIndicator v-else/>
    </div>
  </header>

  <router-view />

  <footer class="footer container">
    <div class="footer__wrapper">
      <ul class="footer__links">
        <li>
          <router-link class="footer__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li>
          <a class="footer__link" href="tel:88006009009">
            8 800 600 90 09
          </a>
        </li>
        <li>
          <a class="footer__link" href="mailto:hi@moire.com">
            hi@moire.com
          </a>
        </li>
        <li>
          <a class="footer__link" href="#">
            Распродажа
          </a>
        </li>
        <li>
          <a class="footer__link footer__link--medium" href="#">
            Заказать звонок
          </a>
        </li>
      </ul>

      <ul class="footer__social social">
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Вконтакте">
            <svg width="20" height="11" fill="currentColor">
              <use xlink:href="#icon-vk"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Инстаграм">
            <svg width="17" height="17" fill="currentColor">
              <use xlink:href="#icon-insta"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Facebook">
            <svg width="17" height="17" fill="currentColor">
              <use xlink:href="#icon-facebook"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Twitter">
            <svg width="17" height="14" fill="currentColor">
              <use xlink:href="#icon-twitter"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Telegram">
            <svg width="19" height="17" fill="currentColor">
              <use xlink:href="#icon-telegram"></use>
            </svg>
          </a>
        </li>
      </ul>

      <p class="footer__desc">
        Все права на материалы, находящиеся на сайте, охраняются в соответствии с законодательством РФ, 
        в том числе об авторском праве и смежных правах.
      </p>

      <ul class="footer__data">
        <li>
          <a class="footer__link" href="#" target="_blank" rel="noopener" type="application/pdf">
            Политика конфиденциальности
          </a>
        </li>
        <li>
          <a class="footer__link" href="#" target="_blank" rel="noopener" type="application/pdf">
            Публичная оферта
          </a>
        </li>
      </ul>

      <span class="footer__copyright">
        © 2020 Moire
      </span>
    </div>
  </footer>
</div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import CartIndicator from '@/components/CartIndicator.vue';

export default {
  data() {
    return {
      cartLoading: false,
    };
  },
  components: { CartIndicator },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.preloadCart();
  },
  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey']),
    preloadCart() {
      this.cartLoading = true;
      clearTimeout(this.loadCartTimer);
      this.loadCartTimer = setTimeout(() => {
        this.loadCart()
          .then(() => { this.cartLoading = false; });
      }, 5000);
    },
  },
  computed: {
    headerInfo() {
      if (this.$route.name === 'main') {
        return "Каталог";
      } else if (this.$route.name === 'product') {
        return "Страница продукта";
      } else if (this.$route.name === 'cart') {
        return "Корзина";
      } else if (this.$route.name === 'order') {
        return "Оформление заказа";
      } else if (this.$route.name === 'orderInfo') {
        return "Информация о заказе";
      } else {
        return 'Wooooops! Page not found';
      }
    },
  },
};
</script>
