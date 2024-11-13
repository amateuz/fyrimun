<script lang="ts" setup>
import IconCart from '@/assets/img/icons/cart.svg'
import IconMenu from '@/components/Menu/MenuIcon.vue'
import PanelMenu from '@/components/Menu/MenuSidePanel.vue'
import PanelCart from '@/components/Cart/CartSidePanel.vue'
import Button from '@/components/Base/BaseButton.vue'
import CartCount from '@/components/Cart/CartCount.vue'
import { useSideMenusStore } from '@/stores/sideMenus'

interface BaseHeaderProps {
  isMenusVisible?: boolean
}

const sideMenus = useSideMenusStore()

const props = withDefaults(defineProps<BaseHeaderProps>(), {
  isMenusVisible: true
})
</script>

<template>
  <header
    :class="['base-header', { 'base-header--narrower': props.isMenusVisible }]"
  >
    <div v-if="props.isMenusVisible" class="base-header__menu-button-container">
      <Button
        :aria-pressed="sideMenus.isMenuOpened"
        aria-label="Toggle Menu"
        class="base-header__button"
        @click="sideMenus.toggleMenu"
      >
        <IconMenu class="base-header__icon" :isOpen="sideMenus.isMenuOpened" />
      </Button>
    </div>
    <img
      alt="Logo"
      class="base-header__logo"
      src="@/assets/img/logo-compressed.webp"
    />
    <div v-if="props.isMenusVisible" class="base-header__cart-button-container">
      <Button
        :aria-pressed="sideMenus.isCartOpened"
        aria-label="Toggle Cart"
        class="base-header__button"
        @click="sideMenus.toggleCart"
      >
        <IconCart />
      </Button>
      <CartCount class="base-header__cart-counter" />
    </div>

    <PanelMenu v-if="props.isMenusVisible" class="base-header__menu" />
    <PanelCart v-if="props.isMenusVisible" class="base-header__cart" />
  </header>
</template>

<style lang="scss" scoped>
.base-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.625rem 1rem;
  border-bottom: 0.8px solid $color-grey--15;

  &--narrower {
    padding: 0.875rem 1.25rem;
    justify-content: space-between;
  }

  &__icon {
    pointer-events: none;
    touch-action: none;
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
