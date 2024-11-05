<script lang="ts" setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/Layout/AppHeader.vue'
import AppFooter from '@/components/Layout/AppFooter.vue'

const isCartMenuOpened = ref<boolean>(false)
const openCartMenu = () => {
  isCartMenuOpened.value = true
}
</script>

<template>
  <AppHeader v-model="isCartMenuOpened" />
  <main class="main">
    <RouterView @openCart="openCartMenu" />
  </main>
  <AppFooter />
</template>

<style lang="scss" scoped>
.main {
  padding-block: 1.5rem;
  padding-inline: 1rem;
}
</style>
