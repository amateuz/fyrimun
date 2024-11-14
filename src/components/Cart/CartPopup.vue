<script setup lang="ts">
import SvgIcon from '@/components/Base/BaseSvgIcon.vue'
import CartCount from '@/components/Cart/CartCount.vue'
</script>

<template>
  <button class="cart-popup">
    <SvgIcon name="trolley-popup" />
    <CartCount class="cart-popup__count" />
  </button>
</template>

<style scoped lang="scss">
.cart-popup {
  padding: 0.75rem;
  border-radius: 100%;

  position: relative;
  z-index: $z-banner;

  background-color: $color-dark-10;
  color: $color-white;

  &__count {
    width: 2rem;
    height: 2rem;

    position: absolute;
    top: -0.75rem;
    right: -0.75rem;

    font-size: 1rem;
  }
}
</style>
