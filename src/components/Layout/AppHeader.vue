<script lang="ts" setup>
import TopBanner from '@/components/Base/BaseBanner.vue'
import BaseHeader from '@/components/Base/BaseHeader.vue'

interface AppHeaderProps {
  isBannerVisible?: boolean
  isMenusVisible?: boolean
}

const props = withDefaults(defineProps<AppHeaderProps>(), {
  isBannerVisible: true,
  isMenusVisible: true
})
</script>

<template>
  <div class="app-header">
    <TopBanner
      v-if="props.isBannerVisible"
      text="Today - Free shipping for all orders over 133.9 $"
    />
    <BaseHeader :is-menus-visible="isMenusVisible" />
  </div>
</template>
