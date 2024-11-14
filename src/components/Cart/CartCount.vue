<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

interface CartCounterProps {
  count?: number
}

defineProps<CartCounterProps>()
const cartStore = useCartStore()
</script>

<template>
  <div class="cart-counter">
    {{ count || cartStore.totalQuantity }}
  </div>
</template>

<style scoped lang="scss">
.cart-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 100%;

  font-size: 0.75rem;

  background-color: $color-red;
  color: $color-white;
}
</style>
