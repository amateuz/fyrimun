<script lang="ts" setup>
import { computed, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useNoAnimation } from '@/composables/useNoAnimation'
import AppHeader from '@/components/Layout/AppHeader.vue'
import AppFooter from '@/components/Layout/AppFooter.vue'

const router = useRouter()
const isBannerVisible = computed(
  () => router.currentRoute.value.name === 'product'
)
const isMenusVisible = computed(
  () => router.currentRoute.value.name !== 'checkout'
)
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
    :is-menus-visible="isMenusVisible"
    :is-banner-visible="isBannerVisible"
    v-model:is-cart-opened="isCartOpened"
    v-model:is-menu-opened="isMenuOpened"
  />
  <main class="main">
    <RouterView @openCart="openCartMenu" />
  </main>
  <AppFooter />
</template>
