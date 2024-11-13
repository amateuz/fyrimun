<script setup lang="ts">
import SidePanel from '@/components/Base/BaseSidePanel.vue'
import IconClose from '@/assets/img/icons/close-cart.svg'
import CartWidget from '@/components/Cart/CartWidget.vue'
import { type Link } from '@/types'
import { useSideMenusStore } from '@/stores/sideMenus'
import { useRouter } from 'vue-router'

const router = useRouter()
const sideMenus = useSideMenusStore()

const buttons: Link[] = [
  {
    href: '/cart',
    text: 'View My Cart',
    type: 'basic'
  },
  {
    href: '/checkout',
    text: 'Process To Secure Checkout',
    type: 'accent'
  }
]

const closeCartPanelWhenSameRoute = (href: string) => {
  sideMenus.isCartOpened = router.currentRoute.value.path !== href
}
</script>

<template>
  <SidePanel
    v-model="sideMenus.isCartOpened"
    class="panel-side-cart"
    width="100%"
    max-width="500px"
    position="right"
    transition-duration="500ms"
  >
    <template #panel-side-top="{ closePanel }">
      <div class="panel-side-cart__top">
        <span class="panel-side-cart__text"> Your shopping cart </span>
        <button
          class="panel-side-cart__close-button"
          @click="closePanel"
          aria-label="Close Panel"
        >
          <IconClose class="panel-side-cart__close-icon" />
        </button>
      </div>
    </template>
    <div class="panel-side-cart__content">
      <CartWidget
        :buttons="buttons"
        @click="closeCartPanelWhenSameRoute"
        type="embed"
      />
    </div>
  </SidePanel>
</template>

<style scoped lang="scss">
.panel-side-cart {
  display: flex;
  flex-direction: column;
  max-width: 500px;

  &__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  &__top {
    @include font-family(Poppins);

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

    font-size: 1rem;

    color: $color-dark;
    border-bottom: 1px solid $color-grey--15;
    background-color: $color-white;
    position: sticky;
    left: 0;
    top: 0;
    z-index: $z-nav;
  }

  &__close-button {
    padding: 0;
    border: none;

    background: none;
    cursor: pointer;
  }

  &__cart-widget {
    width: 100%;
    min-height: 30vh;
  }
}
</style>
