<script setup lang="ts">
import { ref } from 'vue'
import IconCart from '@/assets/img/icons/cart.svg'
import IconMenu from '@/components/Menu/MenuIcon.vue'
import PanelMenu from '@/components/Menu/MenuSidePanel.vue'
import PanelCart from '@/components/Cart/CartSidePanel.vue'
import Button from '@/components/Base/BaseButton.vue'

const isMenuOpened = ref(false)
const isCartOpened = ref(false)

const toggleMenu = () => {
  isMenuOpened.value = !isMenuOpened.value
}

const toggleCart = () => {
  isCartOpened.value = !isCartOpened.value
}
</script>

<template>
  <header class="header-actions">
    <div class="header-actions__menu-button-container">
      <Button
        class="header-actions__button"
        @click="toggleMenu"
        :aria-pressed="isMenuOpened"
        aria-label="Toggle Menu"
      >
        <IconMenu :isOpen="isMenuOpened" />
      </Button>
    </div>
    <img
      class="header-actions__logo"
      src="@/assets/img/logo-compressed.webp"
      alt="Logo"
    />
    <div class="header-actions__cart-button-container">
      <Button
        class="header-actions__button"
        @click="toggleCart"
        :aria-pressed="isCartOpened"
        aria-label="Toggle Cart"
      >
        <IconCart />
      </Button>
    </div>

    <PanelMenu v-model="isMenuOpened" />
    <PanelCart v-model="isCartOpened" />
  </header>
</template>

<style scoped lang="scss">
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: calc(10px + 0.25rem);
  padding-inline: calc(16px + 0.25rem);
  border-bottom: 0.8px solid hsl(220deg 17% 90%);

  &__button {
    width: 20px;
    height: 20px;
    border: none;

    background: none;
    cursor: pointer;
  }

  &__logo {
    width: auto;
    height: 60px;
  }

  &__menu-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
  }

  &__cart-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
  }
}
</style>
