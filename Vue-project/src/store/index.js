import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartLoadError: null,
    orderInfo: {
      basket: {
        items: [],
      },
    },
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
      state.orderInfo.deliveryTitle = orderInfo.deliveryType.title;
      state.orderInfo.deliveryPrice = +orderInfo.deliveryType.price;
    },
    resetCart(state) {
      state.cartProducts = [];
    },
    updateCartProductAmount(state, { basketItemId, quantity }) {
      const productItem = state.cartProducts.find((item) => item.id === basketItemId);
      if (productItem) {
        productItem.quantity = quantity;
      }
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProducts = items.map((item) => ({
        ...item,
        basketItemId: item.id,
        productColorCode: item.color.color.code,
        productColorTitle: item.color.color.title,
        productImage: item.color.gallery[0].file.url,
      }));
    },
  },
  getters: {
    cartTotalPrice(state) {
      return state.cartProducts.reduce((acc, item) => (item.price * item.quantity) + acc, 0);
    },
    cartTotalAmount(state) {
      return state.cartProducts.reduce((acc, item) => item.quantity + acc, 0);
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
        });
    },
    addProductToCart(context, { productId, quantity, colorId, sizeId }) {
      return (new Promise((resolve) => { setTimeout(resolve, 1000); }))
        .then(() => {
          axios
            .post(`${API_BASE_URL}/api/baskets/products`, {
              productId,
              colorId,
              sizeId,
              quantity,
            }, {
              params: {
                userAccessKey: context.state.userAccessKey,
              },
            })
            .then((response) => {
              context.commit('updateCartProductsData', response.data.items);
            });
        });
    },
    updateCartProductAmount(context, { basketItemId, quantity }) {
      context.commit('updateCartProductAmount', { basketItemId, quantity });
      if (quantity < 1) {
        return false;
      }
      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch();
    },
    deleteCartProduct(context, { basketItemId }) {
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          data: {
            basketItemId,
          },
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        });
    },
  },
});
