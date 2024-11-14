<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    tag?: 'a' | 'router-link'
    target?: '_blank' | '_self' | '_parent' | '_top'
  }>(),
  {
    tag: 'router-link'
  }
)

const getLinkHref = computed<string>(() => {
  return props.to ?? props.href ?? ''
})
</script>

<template>
  <component
    :is="props.tag"
    :to="props.tag === 'router-link' ? getLinkHref : undefined"
    :href="props.tag === 'a' ? getLinkHref : '#'"
    :target="props.target"
    class="base-link"
  >
    <slot />
  </component>
</template>
