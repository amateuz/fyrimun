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
  border-radius: 100%;
  background-color: $color-red;
  color: $color-white;
  width: 16px;
  height: 16px;
  font-size: 0.75rem;
}
</style>
