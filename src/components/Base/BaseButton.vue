<script lang="ts" setup>
import type { Properties } from 'csstype'

interface BaseButtonProps {
  height?: Properties['height']
  width?: Properties['width']
  color?: Properties['color']
  backgroundColor?: Properties['backgroundColor']
  type?: 'basic' | 'accent'
  tag?: 'button' | 'a'
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  height: '2.75rem',
  width: '100%',
  color: '#1a2d48',
  backgroundColor: '#d1d5da',
  type: 'basic',
  tag: 'button'
})
</script>

<template>
  <component :is="props.tag" :class="`base-button base-button--${props.type}`">
    <slot></slot>
  </component>
</template>

<style lang="scss" scoped>
.base-button {
  @include font-family(Poppins);

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 2.75rem;
  border-radius: 6px;

  font-size: 1rem;

  &--basic {
    background-color: $color-grey;
    color: $color-dark;
  }

  &--accent {
    background-color: $color-red--5;
    color: $color-white;

    &:hover {
      background-color: $color-red--10;
    }
  }
}
</style>
