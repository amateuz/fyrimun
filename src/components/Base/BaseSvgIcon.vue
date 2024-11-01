<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { computed } from 'vue'

interface SvgIconProps {
  name: string
}

const props = defineProps<SvgIconProps>()

const svgModules = import.meta.glob('../../assets/img/icons/*.svg', {
  eager: true
}) as Record<
  string,
  {
    default: DefineComponent
  }
>

const dynamicComponent = computed(() => {
  const path = `../../assets/img/icons/${props.name}.svg`
  const component = svgModules[path]
  if (!component) {
    console.warn(`SVG icon ${props.name} not found`)
    return null
  }
  return component.default
})
</script>

<template>
  <component :is="dynamicComponent" class="svg-icon" />
</template>

<style scoped>
.svg-icon {
  width: 100%;
  height: auto;
  max-width: 100%;
}
</style>
