<script setup lang="ts">
import TopBanner from '@/components/Base/BaseBanner.vue'
import HeaderActions from '@/components/Base/BaseHeader.vue'

interface AppHeaderProps {
  isBannerVisible: boolean
}

const isMenuOpened = defineModel<boolean>('isMenuOpened', { default: false })
const isCartOpened = defineModel<boolean>('isCartOpened', { default: false })

const props = withDefaults(defineProps<AppHeaderProps>(), {
  isBannerVisible: true
})
</script>

<template>
  <header class="app-header">
    <TopBanner
      v-if="props.isBannerVisible"
      text="Today - Free shipping for all orders over 133.9 $"
    />
    <HeaderActions
      v-model:is-cart-opened="isCartOpened"
      v-model:is-menu-opened="isMenuOpened"
    />
  </header>
</template>
