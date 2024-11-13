import { defineStore } from 'pinia'

export const useAnimationStore = defineStore('animation', {
  state: () => ({
    isEnabled: true
  }),

  actions: {
    disable() {
      this.isEnabled = false
    },

    enable() {
      this.isEnabled = true
    }
  }
})
