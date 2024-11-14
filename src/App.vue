<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useSideMenusStore } from '@/stores/sideMenus'
import { useAnimationStore } from '@/stores/animation'
import AppHeader from '@/components/Layout/AppHeader.vue'
import AppFooter from '@/components/Layout/AppFooter.vue'

const PanelCart = defineAsyncComponent(
  () => import('@/components/Cart/CartSidePanel.vue')
)
const PanelMenu = defineAsyncComponent(
  () => import('@/components/Menu/MenuSidePanel.vue')
)

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
  <div v-if="isMenusVisible" class="side-panels">
    <PanelMenu class="menu" />
    <PanelCart class="cart" />
  </div>
  <AppHeader
    :is-banner-visible="isBannerVisible"
    :is-menus-visible="isMenusVisible"
  />
  <main class="main">
    <RouterView />
  </main>
  <AppFooter />
</template>
