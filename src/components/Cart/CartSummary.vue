<script lang="ts" setup>
import BaseButton from '@/components/Base/BaseButton.vue'
</script>

<template>
  <div class="cart-summary">
    <div class="cart-summary__total">
      <div class="cart-summary__line">
        <span>Subtotal</span>
        <span class="cart-summary__text--large">$0</span>
      </div>
      <div class="cart-summary__line">
        <span>Shipping & taxes calculated at checkout.</span>
      </div>
      <div class="cart-summary__line">
        <span>Total</span>
        <span class="cart-summary__text--accent">$0</span>
      </div>
    </div>
    <div class="cart-summary__buttons">
      <BaseButton>View My Cart</BaseButton>
      <BaseButton type="accent">Process To Secure Checkout</BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins/font-family' as *;

.cart-summary {
  @include font-family(Poppins);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 1.5rem;
  padding: 1rem;

  font-size: 14px;

  color: #1a2d48;
  border-top: 1px solid hsl(220deg 17% 90%);
  margin-top: auto;

  &__total {
    flex: 1 1 auto;
    display: flex;
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

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
