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
  background-color: #08170c;
  padding: 0.75rem;
  color: #fff;
  border-radius: 100%;
  z-index: $z-banner;
  position: relative;

  &__count {
    position: absolute;
    height: 2rem;
    width: 2rem;
    font-size: 1rem;
    top: -0.75rem;
    right: -0.75rem;
  }
}
</style>
