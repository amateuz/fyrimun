<script setup lang="ts">
import TopBanner from '@/components/Base/BaseBanner.vue'
import HeaderActions from '@/components/Base/BaseHeader.vue'

const isCartMenuOpened = defineModel<boolean>('modelValue', { default: false })
</script>

<template>
  <header class="app-header">
    <TopBanner text="Today - Free shipping for all orders over 133.9 $" />
    <HeaderActions v-model="isCartMenuOpened" />
  </header>
</template>
