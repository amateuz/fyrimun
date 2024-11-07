<script setup lang="ts">
import { Link } from '@/types'
import CartWidget from '@/components/Cart/CartWidget.vue'

const buttons: [Link] = [
  {
    text: 'Proceed To Checkout',
    href: '/checkout',
    type: 'accent'
  },
  {
    text: 'Continue Shopping',
    href: '/',
    type: 'basic'
  }
]
</script>

<template>
  <div>
    <CartWidget
      :buttons="buttons"
      heading="Your Cart"
      total-heading="Cart totals"
      type="standalone"
    />
  </div>
</template>
