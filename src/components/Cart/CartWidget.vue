<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import CartItem from '@/components/Cart/CartItem.vue'
import CartSummary from '@/components/Cart/CartSummary.vue'

const cartStore = useCartStore()
</script>

<template>
  <div class="cart-widget">
    <div class="cart-widget__items">
      <CartItem
        v-for="(cartProduct, index) in cartStore.cartProducts"
        :key="`cart-product-${index}`"
        v-model="cartStore.cartProducts[index]"
      />
    </div>
    <CartSummary />
  </div>
</template>

<style scoped lang="scss">
.cart-widget {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  &__items {
    padding: 1rem;
    height: 100%;
  }
}
</style>
