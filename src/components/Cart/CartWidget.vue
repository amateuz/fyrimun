<script setup lang="ts">
import CartItems from '@/components/Cart/CartItem.vue'
import CartSummary from '@/components/Cart/CartSummary.vue'
</script>

<template>
  <div class="cart-widget">
    <CartItems />
    <CartSummary />
  </div>
</template>

<style scoped lang="scss">
.cart-widget {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
}
</style>
