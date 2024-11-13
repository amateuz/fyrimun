<script lang="ts" setup>
import TopBanner from '@/components/Base/BaseBanner.vue'
import HeaderActions from '@/components/Base/BaseHeader.vue'

interface AppHeaderProps {
  isBannerVisible?: boolean
  isMenusVisible?: boolean
}

const isMenuOpened = defineModel<boolean>('isMenuOpened', { default: false })
const isCartOpened = defineModel<boolean>('isCartOpened', { default: false })

const props = withDefaults(defineProps<AppHeaderProps>(), {
  isBannerVisible: true,
  isMenusVisible: true
})
</script>

<template>
  <header class="app-header">
    <TopBanner
      v-if="props.isBannerVisible"
      text="Today - Free shipping for all orders over 133.9 $"
    />
    <HeaderActions
      :is-menus-visible="isMenusVisible"
      v-model:is-cart-opened="isCartOpened"
      v-model:is-menu-opened="isMenuOpened"
    />
  </header>
</template>
