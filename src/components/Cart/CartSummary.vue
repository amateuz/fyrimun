<script lang="ts" setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import Link from '@/components/Base/BaseLink.vue'

const cartStore = useCartStore()
const getFormattedTotalPrice = computed(() => {
  return parseFloat(cartStore.totalPrice.toFixed(2)).toString()
})
</script>

<template>
  <div class="cart-summary">
    <div class="cart-summary__total">
      <div class="cart-summary__line">
        <span>Subtotal</span>
        <span class="cart-summary__text--large">{{
          `${getFormattedTotalPrice}$`
        }}</span>
      </div>
      <div class="cart-summary__line">
        <span>Shipping & taxes calculated at checkout.</span>
      </div>
      <div class="cart-summary__line">
        <span>Total</span>
        <span class="cart-summary__text--accent">{{
          `${getFormattedTotalPrice}$`
        }}</span>
      </div>
    </div>
    <div class="cart-summary__links">
      <Link class="cart-summary__link cart-summary__link--basic" to="/cart"
        >View My Cart
      </Link>
      <Link
        class="cart-summary__link cart-summary__link--accent"
        to="/checkout"
        type="accent"
        >Process To Secure Checkout
      </Link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-summary {
  @include font-family(Poppins);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 1.5rem;
  margin-top: auto;
  padding: 1rem;

  font-size: 14px;

  color: $color-dark;
  border-top: 1px solid $color-grey--15;

  &__total {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__line {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__text {
    &--accent {
      font-size: 18px;
      font-weight: 600;
    }

    &--large {
      font-size: 16px;
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__link {
    @include button-shared;
    width: 100%;
    height: 2.75rem;

    &--basic {
      @include button-basic($hover: false);
    }

    &--accent {
      @include button-accent($hover: false);
    }
  }
}
</style>
