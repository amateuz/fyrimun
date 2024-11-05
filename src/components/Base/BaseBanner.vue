<script lang="ts" setup>
interface BaseBannerProps {
  text: string
}

defineProps<BaseBannerProps>()
</script>

<template>
  <div class="base-banner" role="banner">
    {{ text }}
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins/font-family' as *;

.base-banner {
  @include font-family(Poppins);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  overflow-x: hidden;

  position: relative;
  text-wrap: pretty;

  z-index: $z-banner;

  text-align: center;

  background-color: $color-red--5;
  color: $color-white;
}
</style>
