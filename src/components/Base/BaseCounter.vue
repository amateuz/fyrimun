<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from '@/components/Base/BaseSvgIcon.vue'

interface BaseCounterProps {
  min?: number
  max?: number
}

const props = withDefaults(defineProps<BaseCounterProps>(), {
  min: 1,
  max: undefined
})

const quantity = defineModel<number>('modelValue', {
  default: 1
})

const isMinLimitOrLower = computed<boolean>(() => {
  return quantity.value! > props.min
})
const isMaxLimitOrHigher = computed<boolean>(() => {
  return props.max ? quantity.value! < props.max : true
})
const decrement = () => {
  if (!isMinLimitOrLower.value) return
  quantity.value!--
}
const increment = () => {
  if (!isMaxLimitOrHigher.value) return
  quantity.value!++
}
</script>

<template>
  <div class="base-counter">
    <button
      class="base-counter__decrement"
      @click="decrement"
      :disabled="!isMinLimitOrLower"
    >
      <SvgIcon name="minus" />
    </button>
    <div class="base-counter__quantity">
      {{ quantity }}
    </div>
    <button
      class="base-counter__increment"
      @click="increment"
      :disabled="!isMaxLimitOrHigher"
    >
      <SvgIcon name="plus" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.base-counter {
  $r: &;

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid $color-grey;
  border-radius: 0.25rem;

  font-size: 1rem;

  color: $color-dark;

  &__decrement,
  &__increment {
    padding: 0 0.5rem;

    &[disabled]:not([disabled='false']) {
      @include set-non-interactive;
      opacity: 0.5;
    }
  }

  &__decrement,
  &__increment,
  &__quantity {
    height: 100%;
  }

  &__quantity {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }
}
</style>
