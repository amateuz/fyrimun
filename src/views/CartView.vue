<script setup lang="ts">
import CartWidget from '@/components/Cart/CartWidget.vue'
import { checkoutButtons } from '@/constants/checkoutButtons'
</script>

<template>
  <CartWidget
    :buttons="checkoutButtons"
    heading="Your Cart"
    total-heading="Cart totals"
    type="cart"
  />
</template>
