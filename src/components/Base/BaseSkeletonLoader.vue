<script setup lang="ts">
import type { Properties } from 'csstype'

defineProps<{
  width?: Properties['width']
  height?: Properties['height']
  aspectRatio?: Properties['aspectRatio']
}>()
</script>

<template>
  <div
    class="base-skeleton-loader"
    :style="{ width, height, aspectRatio }"
  ></div>
</template>

<style scoped lang="scss">
.base-skeleton-loader {
  background-color: #e0e0e0;
  position: relative;
  overflow: hidden;
  border-radius: 6px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
