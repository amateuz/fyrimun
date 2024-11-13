<script lang="ts" setup>
import IconCart from '@/assets/img/icons/cart.svg'
import IconMenu from '@/components/Menu/MenuIcon.vue'
import PanelMenu from '@/components/Menu/MenuSidePanel.vue'
import PanelCart from '@/components/Cart/CartSidePanel.vue'
import Button from '@/components/Base/BaseButton.vue'
import CartCount from '@/components/Cart/CartCount.vue'

interface BaseHeaderProps {
  isMenusVisible?: boolean
}

const props = withDefaults(defineProps<BaseHeaderProps>(), {
  isMenusVisible: true
})
const isMenuOpened = defineModel('isMenuOpened', { default: false })
const isCartOpened = defineModel('isCartOpened', { default: false })

const toggleMenu = () => {
  isMenuOpened.value = !isMenuOpened.value
}

const toggleCart = () => {
  isCartOpened.value = !isCartOpened.value
}
</script>

<template>
  <header
    :class="[
      'header-actions',
      { 'header-actions--narrower': props.isMenusVisible }
    ]"
  >
    <div
      v-if="props.isMenusVisible"
      class="header-actions__menu-button-container"
    >
      <Button
        :aria-pressed="isMenuOpened"
        aria-label="Toggle Menu"
        class="header-actions__button"
        @click="toggleMenu"
      >
        <IconMenu :isOpen="isMenuOpened" />
      </Button>
    </div>
    <img
      alt="Logo"
      class="header-actions__logo"
      src="@/assets/img/logo-compressed.webp"
    />
    <div
      v-if="props.isMenusVisible"
      class="header-actions__cart-button-container"
    >
      <Button
        :aria-pressed="isCartOpened"
        aria-label="Toggle Cart"
        class="header-actions__button"
        @click="toggleCart"
      >
        <IconCart />
      </Button>
      <CartCount class="header-actions__cart-counter" />
    </div>

    <PanelMenu
      v-if="props.isMenusVisible"
      v-model="isMenuOpened"
      class="header-actions__menu"
    />
    <PanelCart
      v-if="props.isMenusVisible"
      v-model="isCartOpened"
      class="header-actions__cart"
    />
  </header>
</template>

<style lang="scss" scoped>
.header-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.625rem 1rem;
  border-bottom: 0.8px solid $color-grey--15;

  &--narrower {
    padding: 0.875rem 1.25rem;
    justify-content: space-between;
  }

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
    position: relative;
  }

  &__cart-counter {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
