<script setup lang="ts">
import TopBanner from '@/components/Base/BaseBanner.vue'
import HeaderActions from '@/components/Base/BaseHeader.vue'

const isMenuOpened = defineModel<boolean>('isMenuOpened', { default: false })
const isCartOpened = defineModel<boolean>('isCartOpened', { default: false })
</script>

<template>
  <header class="app-header">
    <TopBanner text="Today - Free shipping for all orders over 133.9 $" />
    <HeaderActions
      v-model:is-cart-opened="isCartOpened"
      v-model:is-menu-opened="isMenuOpened"
    />
  </header>
</template>
