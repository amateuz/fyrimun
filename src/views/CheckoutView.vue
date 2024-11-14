<script lang="ts" setup>
import CartWidget from '@/components/Cart/CartWidget.vue'
import BaseForm from '@/components/Base/BaseForm.vue'
import trustBadge from '@/assets/img/trust-badge.png'
</script>

<template>
  <CartWidget heading="Order summary" theme="darker" type="checkout" />

  <section class="checkout-view__payment-form payment-form">
    <h5 class="payment-form__heading">Payment method</h5>
    <BaseForm />
    <div class="payment-form__security">
      <div class="payment-form__security-text">
        All transactions are secure and encrypted by
      </div>
      <img
        :src="trustBadge"
        alt="secure by McAfee VeriSign Norton Truste"
        class="payment-form__img"
        loading="lazy"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.payment-form {
  @include font-family(Poppins);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem 1rem;

  &__heading {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: left;

    color: $color-dark;
    align-self: flex-start;
  }

  &__security {
    @include font-family(Inter);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  &__img {
    max-width: 314px;
  }
}
</style>
