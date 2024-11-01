<script lang="ts" setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/Layout/AppHeader.vue'
import AppFooter from '@/components/Layout/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <main class="main">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style lang="scss" scoped>
.main {
  padding-block: 1.5rem;
  padding-inline: 1rem;
}
</style>
