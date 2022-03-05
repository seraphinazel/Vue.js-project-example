<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар" @click="reduceAmount()">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>
    <input type="number" step="1" v-model.number="currentAmount">
    <button type="button" aria-label="Добавить один товар" @click="addAmount()">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    currentAmount: {
      get() {
        return this.amount;
      },
      set(value) {
        if (value > 0) {
          this.$emit('update:amount', +value);
        }
      },
    },
  },
  props: ['amount'],
  methods: {
    addAmount() {
      this.$emit('update:amount', +this.currentAmount + 1);
    },
    reduceAmount() {
      if (this.currentAmount > 1) {
        this.$emit('update:amount', +this.currentAmount - 1);
      }
    },
  },
};
</script>
