<script lang="ts" setup>
import type { Properties } from 'csstype'

const percents = defineModel<number | undefined>('modelValue', { default: 100 })
const props = withDefaults(
  defineProps<{
    updateFrequency?: Properties['transitionDuration']
  }>(),
  {
    updateFrequency: '100ms'
  }
)
</script>

<template>
  <div class="base-progress">
    <div class="base-progress__progress-bar">
      <div
        :style="{ transform: `scaleX(${percents! / 100})` }"
        class="base-progress__progress"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-progress {
  &__progress-bar {
    width: 100%;
    height: 10px;
    overflow: hidden;

    position: relative;

    background-color: $color-grey--10;
  }

  &__progress {
    height: 100%;

    background-color: $color-grey-10;
    transform-origin: left center;

    transition: transform v-bind('props.updateFrequency') linear;
  }
}
</style>
