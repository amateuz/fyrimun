<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface TimerProps {
  timeLeft?: number
  updateFrequency?: number
  timeIsUpText?: string
}

const props = withDefaults(defineProps<TimerProps>(), {
  timeLeft: 10 * 60,
  updateFrequency: 20,
  timeIsUpText: 'HURRY UP. THIS DEAL WILL END SOON!!'
})

// used in <styles> v-bind
const updateFrequencySuffix = `${props.updateFrequency}ms`
const initialTimeMs = props.timeLeft * 1000
const remainingTimeMs = ref(initialTimeMs)

let targetEndTime: number
let timeoutId: ReturnType<typeof setTimeout> | null = null

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(remainingTimeMs.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = remainingTimeMs.value % 1000

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`
})

const getTimerText = computed(() => {
  return remainingTimeMs.value > 0 ? formattedTime.value : props.timeIsUpText
})

const progressPercentage = computed(() => {
  return (remainingTimeMs.value / initialTimeMs) * 100
})

const updateTimer = () => {
  const currentTime = Date.now()
  const timeDifferenceMs = targetEndTime - currentTime

  remainingTimeMs.value = Math.max(timeDifferenceMs, 0)

  if (remainingTimeMs.value > 0) {
    timeoutId = setTimeout(updateTimer, props.updateFrequency)
  }
}

onMounted(() => {
  targetEndTime = Date.now() + remainingTimeMs.value
  updateTimer()
})

onUnmounted(() => {
  if (!timeoutId) return

  clearTimeout(timeoutId)
})
</script>

<template>
  <div class="base-timer">
    <div class="base-timer__header">
      <span class="base-timer__label">SALE ENDING IN</span>
    </div>
    <div class="base-timer__progress-bar">
      <div
        class="base-timer__progress"
        :style="{ transform: `scaleX(${progressPercentage / 100})` }"
      ></div>
    </div>
    <div class="base-timer__time">{{ getTimerText }}</div>
  </div>
</template>

<style scoped lang="scss">
.base-timer {
  @include font-family(Poppins);

  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  font-size: 1rem;
  text-align: left;

  color: $color-dark;

  &__header {
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
  }

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

    transition: transform v-bind('updateFrequencySuffix') linear;
  }

  &__time {
    color: $color-red--7;
  }

  &__text {
    color: $color-red;
  }
}
</style>
