import { defineStore } from 'pinia'

export const useSideMenusStore = defineStore('sideMenus', {
  state: () => ({
    isMenuOpened: false,
    isCartOpened: false
  }),

  actions: {
    openCart() {
      this.isCartOpened = true
    },

    openMenu() {
      this.isMenuOpened = true
    },

    toggleCart() {
      this.isCartOpened = !this.isCartOpened
    },

    toggleMenu() {
      this.isMenuOpened = !this.isMenuOpened
    },

    closeCart() {
      this.isCartOpened = false
    },

    closeMenu() {
      this.isMenuOpened = false
    }
  }
})
