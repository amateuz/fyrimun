<script lang="ts" setup>
import { computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useNoAnimation } from '@/composables/useNoAnimation'
import AppHeader from '@/components/Layout/AppHeader.vue'
import AppFooter from '@/components/Layout/AppFooter.vue'
import { useSideMenusStore } from '@/stores/sideMenus'

const router = useRouter()
const sideMenus = useSideMenusStore()
const isBannerVisible = computed(
  () => router.currentRoute.value.name === 'product'
)
const isMenusVisible = computed(
  () => router.currentRoute.value.name !== 'checkout'
)

const animation = useNoAnimation()

router.beforeEach(() => {
  animation.disableAnimation()
  sideMenus.closeCart()
  sideMenus.closeMenu()
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
  />
  <main class="main">
    <RouterView />
  </main>
  <AppFooter />
</template>
