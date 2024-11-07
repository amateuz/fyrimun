<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { Link as LinkType } from '@/types'
import CartItem from '@/components/Cart/CartItem.vue'
import Link from '@/components/Base/BaseLink.vue'
import BaseSeparator from '@/components/Base/BaseSeparator.vue'

const cartStore = useCartStore()
const getFormattedTotalPrice = computed(() => {
  return parseFloat(cartStore.totalPrice.toFixed(2)).toString()
})

interface CartWidgetProps {
  heading?: string
  totalHeading?: string
  type?: 'embed' | 'standalone'
  buttons?: Array<LinkType>
}

const props = withDefaults(defineProps<CartWidgetProps>(), {
  type: 'standalone'
})

const isStandalone = computed(() => {
  return props.type === 'standalone'
})
</script>

<template>
  <div :class="`cart-widget cart-widget--${type}`">
    <h3 v-if="heading" class="cart-widget__heading">
      {{ heading }}
    </h3>
    <div class="cart-widget__items">
      <CartItem
        v-for="(cartProduct, index) in cartStore.cartProducts"
        :key="`cart-product-${index}`"
        v-model="cartStore.cartProducts[index]"
      />
    </div>
    <div class="cart-total">
      <h5 v-if="totalHeading" class="cart-total__heading">
        {{ totalHeading }}
      </h5>
      <div class="cart-total__total">
        <div class="cart-total__line">
          <span
            >Subtotal
            <template v-if="isStandalone"
              >({{ cartStore.totalQuantity }} items)</template
            ></span
          >
          <span class="cart-total__text--large">{{
            `$${getFormattedTotalPrice}`
          }}</span>
        </div>
        <div class="cart-total__line">
          <span>Shipping & taxes calculated at checkout.</span>
        </div>
        <div class="cart-total__line">
          <span>Total</span>
          <span class="cart-total__text--accent">{{
            `$${getFormattedTotalPrice}`
          }}</span>
        </div>
      </div>
      <div class="cart-total__links">
        <div v-if="isStandalone" class="cart-total__tax">
          Tax & shipping calculated at checkout.
        </div>
        <template
          v-for="(button, index) in props.buttons"
          :key="`button-${index}`"
        >
          <Link
            :class="`cart-total__link cart-total__link--${button.type}`"
            :to="button.href"
          >
            {{ button.text }}
          </Link>
          <BaseSeparator
            v-if="isStandalone && index !== props.buttons.length - 1"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-widget {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  &--embed {
    position: relative;

    .cart-total {
      background-color: $color-white;
      position: sticky;
      left: 0;
      bottom: 0;
      z-index: $z-nav;
      border-top: 1px solid $color-grey--15;

      &__text {
        &--accent {
          font-weight: 600;
        }
      }
    }
  }

  &--standalone {
    .cart-total {
      margin-top: 4rem;
      margin-bottom: 1rem;

      &__heading {
        border-bottom: 1px solid $color-grey;
        padding-bottom: 1rem;
      }

      &__line {
        font-size: 1rem;
        line-height: 2.25rem;
        font-weight: 400;
        margin-bottom: 0.25rem;

        &:last-of-type {
          margin-bottom: 1rem;
        }
      }

      &__tax {
        @include font-family(Poppins);
        color: $color-grey-5;
        font-size: 0.875rem;
        width: 100%;
        text-align: center;
        line-height: 1.375rem;
      }

      &__text {
        &--accent,
        &--large {
          font-size: 1.5rem;
        }
      }

      &__total {
        border-bottom: 1px solid $color-grey--15;
        gap: 0;
      }

      &__links {
        margin-top: 1rem;
        gap: 1.5rem;
      }

      &__link {
        height: 3rem;

        &--basic {
          &:hover {
            background-color: $color-grey-1;
          }
        }

        &--accent {
          &:hover {
            background-color: $color-red--10;
          }
        }
      }
    }
  }

  &__heading {
    @include font-family(Poppins);
    color: $color-dark;
    font-size: 2.5rem;
    font-weight: 700;
    padding-top: 2.5rem;
    padding-bottom: 1.5rem;
    text-align: center;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 100%;
  }
}

.cart-total {
  @include font-family(Poppins);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 1.5rem;
  margin-top: auto;

  font-size: 0.875rem;
  padding: 1rem;

  color: $color-dark;

  &__heading {
    font-size: 1.5rem;
    font-weight: 600;
    padding-bottom: 1rem;
  }

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
      font-size: 1.125rem;
    }

    &--large {
      font-size: 1rem;
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
