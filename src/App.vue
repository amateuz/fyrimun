<script lang="ts" setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useNoAnimation } from '@/composables/useNoAnimation'
import AppHeader from '@/components/Layout/AppHeader.vue'
import AppFooter from '@/components/Layout/AppFooter.vue'

const isMenuOpened = ref<boolean>(false)
const isCartOpened = ref<boolean>(false)
const animation = useNoAnimation()
const openCartMenu = () => {
  isCartOpened.value = true
}
const closeMenus = () => {
  isMenuOpened.value = false
  isCartOpened.value = false
}

const router = useRouter()
router.beforeEach(() => {
  animation.disableAnimation()
  closeMenus()
})
router.afterEach(() => {
  // move to the end of event loop
  setTimeout(animation.enableAnimation)
})
</script>

<template>
  <AppHeader
    v-model:is-cart-opened="isCartOpened"
    v-model:is-menu-opened="isMenuOpened"
  />
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
