<script lang="ts" setup>
import { computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from '@/components/Layout/AppHeader.vue'
import AppFooter from '@/components/Layout/AppFooter.vue'
import { useSideMenusStore } from '@/stores/sideMenus'
import { useAnimationStore } from '@/stores/animation'

const router = useRouter()
const sideMenus = useSideMenusStore()
const isBannerVisible = computed(
  () => router.currentRoute.value.name === 'product'
)
const isMenusVisible = computed(
  () => router.currentRoute.value.name !== 'checkout'
)

const animation = useAnimationStore()

router.beforeEach(() => {
  animation.disable()
  sideMenus.closeCart()
  sideMenus.closeMenu()
})
router.afterEach(() => {
  // move to the end of event loop
  setTimeout(animation.enable)
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
