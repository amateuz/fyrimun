<script setup lang="ts">
import { type Link } from '@/types'
import CartWidget from '@/components/Cart/CartWidget.vue'

defineOptions({
  inheritAttrs: false
})

const buttons: Link[] = [
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
  <CartWidget
    :buttons="buttons"
    heading="Your Cart"
    total-heading="Cart totals"
    type="cart"
  />
</template>
