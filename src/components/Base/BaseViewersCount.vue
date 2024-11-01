<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ViewersCountProductProps {
  isDynamic?: boolean
  viewersCount?: number
  min?: number
  max?: number
  interval?: number
}

const props = withDefaults(defineProps<ViewersCountProductProps>(), {
  isDynamic: true,
  min: 500,
  max: 700,
  interval: 5000
})

const viewersCount = ref<number>(props.viewersCount || generateRandomViewers())
let intervalId: ReturnType<typeof setInterval> | null = null

function generateRandomViewers() {
  return Math.round(Math.random() * (props.max - props.min) + props.min)
}

function updateViewersCount() {
  viewersCount.value = generateRandomViewers()
}

onMounted(() => {
  if (!props.isDynamic) return
  intervalId = setInterval(updateViewersCount, props.interval)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="base-viewers-count">
    <span class="base-viewers-count__count">
      {{ viewersCount }}
    </span>
    People are viewing right now
  </div>
</template>

<style lang="scss" scoped>
.base-viewers-count {
  @include font-family(Poppins);
  font-size: 1rem;

  color: #1a2d48;

  &__count {
    font-weight: 700;
  }
}
</style>
