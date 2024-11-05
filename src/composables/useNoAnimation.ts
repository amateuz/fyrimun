import { ref } from 'vue'

const isNoAnimation = ref(false)

function disableAnimation() {
  isNoAnimation.value = true
}

function enableAnimation() {
  isNoAnimation.value = false
}

export function useNoAnimation() {
  return {
    isNoAnimation,
    disableAnimation,
    enableAnimation
  }
}
