<script setup lang="ts">
import { computed } from 'vue'
import IconBurger from '@/assets/img/icons/burger.svg'
import IconClose from '@/assets/img/icons/close.svg'

interface IconMenuProps {
  isOpen: boolean
}

const props = defineProps<IconMenuProps>()
const iconComponent = computed(() => {
  return props.isOpen ? IconClose : IconBurger
})
</script>

<template>
  <component :is="iconComponent" class="icon-menu" />
</template>
