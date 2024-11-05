<script setup lang="ts">
import Button from '@/components/Base/BaseButton.vue'
import Link from '@/components/Base/BaseLink.vue'
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__top">
      <Link href="/" class="app-footer__link">
        <img
          alt="logo"
          class="app-footer__logo"
          src="@/assets/img/logo-compressed.webp"
        />
      </Link>
      <div class="app-footer__email">support@walnese.com</div>
    </div>
    <div class="app-footer__link-section">
      <div class="app-footer__heading">Support</div>
      <div class="app-footer__link-container">
        <Link class="app-footer__link" href="/order-tracking">
          Order Tracking
        </Link>
        <Button
          class="app-footer__link app-footer__link--button"
          type="accent"
          tag="a"
          href="/contact-us"
          >Contact Us
        </Button>
      </div>
    </div>
    <div class="app-footer__link-section">
      <div class="app-footer__heading">Policy</div>
      <div class="app-footer__link-container">
        <Link class="app-footer__link" href="/refund-policy">
          Return & Refund Policy
        </Link>
        <Link class="app-footer__link" href="/privacy-policy">
          Privacy Policy
        </Link>
        <Link class="app-footer__link" href="/shipping-policy">
          Shipping Policy
        </Link>
        <Link class="app-footer__link" href="/term-of-service">
          Term Of Service
        </Link>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  @include font-family(Poppins);

  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2.25rem 1rem 3.5rem;

  background-color: $color-dark-3;

  &__top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  &__email {
    font-size: 0.875rem;
    line-height: 1.375rem;
    text-align: left;

    color: $color-white;
  }

  &__link-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__heading {
    font-size: 1.125rem;
    line-height: 1.625rem;

    color: $color-white;
  }

  &__link-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__link {
    font-size: 0.875rem;
    font-weight: 500;

    color: $color-white;

    &:hover {
      text-decoration: underline;
    }

    &--button {
      padding: 0.5rem 1.5rem;
      width: fit-content;
      height: auto;
      border-radius: 4px;

      font-weight: 400;
      line-height: 1.375rem;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
