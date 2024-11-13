<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseProgress from '@/components/Base/BaseProgress.vue'
import { useTimerStore } from '@/stores/timer'

interface TimerProps {
  heading?: string
  time?: number
  updateFrequency?: number
  timeIsUpText?: string
  showProgressBar?: boolean
  timeFormat?: string
  useStore?: boolean
}

const props = withDefaults(defineProps<TimerProps>(), {
  time: 10 * 60 * 1000,
  updateFrequency: 20,
  timeFormat: 'mm:ss.SSS',
  useStore: true
})

const timerStore = useTimerStore()

// used in <styles> v-bind
const updateFrequencyWithSuffix = `${props.updateFrequency}ms`
const originalInitialTime = props.time
const initialTimeMs = props.useStore
  ? (timerStore.timeLeft ?? props.time)
  : props.time
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
  return (remainingTimeMs.value / originalInitialTime) * 100
})

const updateTimer = () => {
  const currentTime = Date.now()
  const timeDifferenceMs = targetEndTime - currentTime

  remainingTimeMs.value = Math.max(timeDifferenceMs, 0)
  if (props.useStore) timerStore.update(remainingTimeMs.value)

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
    <BaseProgress
      v-if="showProgressBar"
      v-model="progressPercentage"
      :update-frequency="updateFrequencyWithSuffix"
    />
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

  &__time {
    color: $color-red--7;
  }

  &__text {
    color: $color-red;
  }
}
</style>
