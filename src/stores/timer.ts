import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    timeLeft: null as number | null
  }),

  actions: {
    update(time: number) {
      this.timeLeft = time
    }
  },
  persist: true
})
