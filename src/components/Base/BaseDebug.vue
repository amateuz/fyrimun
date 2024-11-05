<script setup lang="ts"></script>

<template>
  <div class="base-debug">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.base-debug {
  height: auto;
  max-height: 64px;

  position: fixed;
  inset: 0;

  z-index: 9999;

  background-color: $color-grey-5;
}
</style>
