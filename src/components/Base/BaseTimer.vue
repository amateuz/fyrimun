<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface TimerProps {
  heading?: string
  timeLeft?: number
  updateFrequency?: number
  timeIsUpText?: string
  showProgressBar?: boolean
  timeFormat?: string
}

const props = withDefaults(defineProps<TimerProps>(), {
  timeLeft: 10 * 60,
  updateFrequency: 20,
  timeFormat: 'mm:ss.SSS'
})

// used in <styles> v-bind
const updateFrequencyWithSuffix = `${props.updateFrequency}ms`
const initialTimeMs = props.timeLeft * 1000
const remainingTimeMs = ref(initialTimeMs)

let targetEndTime: number
let timeoutId: ReturnType<typeof setTimeout> | null = null

function formatTime(
  remainingTimeMs: number,
  format: string = props.timeFormat
): string {
  const totalSeconds = Math.floor(remainingTimeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const milliseconds = remainingTimeMs % 1000

  const timeComponents: Record<'HH' | 'mm' | 'ss' | 'SSS', string> = {
    HH: hours.toString().padStart(2, '0'),
    mm: minutes.toString().padStart(2, '0'),
    ss: seconds.toString().padStart(2, '0'),
    SSS: milliseconds.toString().padStart(3, '0')
  }

  return format.replace(
    /HH|mm|ss|SSS/g,
    (match) => timeComponents[match as keyof typeof timeComponents] || ''
  )
}

const formattedTime = computed(() => formatTime(remainingTimeMs.value))
const getTimerText = computed(() =>
  remainingTimeMs.value > 0
    ? formattedTime.value
    : props.timeIsUpText || formattedTime
)

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
    <h5 v-if="props.heading" class="base-timer__heading">
      {{ props.heading }}
    </h5>
    <div v-if="props.showProgressBar" class="base-timer__progress-bar">
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

  &__heading {
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

    transition: transform v-bind('updateFrequencyWithSuffix') linear;
  }

  &__time {
    color: $color-red--7;
  }

  &__text {
    color: $color-red;
  }
}
</style>
