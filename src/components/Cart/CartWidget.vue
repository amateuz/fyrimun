<script lang="ts" setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { type Link as LinkType } from '@/types'
import CartItem from '@/components/Cart/CartItem.vue'
import Link from '@/components/Base/BaseLink.vue'
import BaseSeparator from '@/components/Base/BaseSeparator.vue'
import limitedStock from '@/assets/img/limited-stock.png'
import BaseTimer from '@/components/Base/BaseTimer.vue'
import { getFormattedPrice } from '@/utils/getFormattedPrice'

interface CartWidgetProps {
  heading?: string
  totalHeading?: string
  type?: 'embed' | 'cart' | 'checkout'
  buttons?: Array<LinkType>
  theme?: 'default' | 'darker'
}

const props = withDefaults(defineProps<CartWidgetProps>(), {
  type: 'cart'
})
const emit = defineEmits<{ click: [string] }>()

const cartStore = useCartStore()
const getFormattedTotalPrice = computed(() => {
  return getFormattedPrice(cartStore.totalPrice)
})

const isCart = computed(() => {
  return props.type === 'cart'
})
const isCheckout = computed(() => {
  return props.type === 'checkout'
})

const shippingCost = 0
</script>

<template>
  <div
    :class="[
      'cart-widget',
      `cart-widget--${props.type}`,
      { [`cart-widget--theme-${props.theme}`]: props.theme }
    ]"
  >
    <h3 v-if="heading" class="cart-widget__heading">
      {{ heading }}
    </h3>
    <div class="cart-widget__items">
      <CartItem
        v-for="(cartProduct, index) in cartStore.cartProducts"
        :key="`cart-product-${index}`"
        v-model="cartStore.cartProducts[index]"
        :is-interactive="!isCheckout"
        :theme="props.theme"
      />
    </div>
    <div class="cart-widget__cart-total cart-total">
      <h5 v-if="totalHeading" class="cart-total__heading">
        {{ totalHeading }}
      </h5>
      <div class="cart-total__total">
        <div class="cart-total__line">
          <span
            >Subtotal
            <template v-if="isCart || isCheckout"
              >({{ cartStore.totalQuantity }} items)</template
            ></span
          >
          <span class="cart-total__text--large">{{
            `$${getFormattedTotalPrice}`
          }}</span>
        </div>
        <div v-if="isCheckout" class="cart-total__line">
          <span>Shipping</span>
          <span> ${{ shippingCost }}</span>
        </div>
        <div v-else class="cart-total__line">
          <span>Shipping & taxes calculated at checkout.</span>
        </div>
        <BaseSeparator v-if="isCheckout" />
        <div class="cart-total__line">
          <span>Total</span>
          <span class="cart-total__text--accent">{{
            `$${getFormattedTotalPrice}`
          }}</span>
        </div>
      </div>
      <div v-if="props.buttons" class="cart-total__links">
        <div v-if="isCart" class="cart-total__tax">
          Tax & shipping calculated at checkout.
        </div>
        <template
          v-for="(button, index) in props.buttons"
          :key="`button-${index}`"
        >
          <Link
            :class="`cart-total__link cart-total__link--${button.type}`"
            :to="button.href"
            @click="emit('click', button.href)"
          >
            {{ button.text }}
          </Link>
          <BaseSeparator
            v-if="isCart && props.buttons && index !== props.buttons.length - 1"
          />
        </template>
      </div>
    </div>
    <div v-if="isCheckout" class="cart-widget__promo cart-promo">
      <div class="cart-promo__img-container">
        <img :src="limitedStock" alt="limited stock" class="cart-promo__img" />
      </div>
      <div class="cart-promo__text-content">
        <h5 class="cart-promo__heading">Limited Stock!</h5>
        <div class="cart-promo__text">
          No worries, we have reserved your order. Your order is reserved for
          <BaseTimer class="cart-promo__timer" time-format="mm:ss" />
          minutes
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-widget {
  $r: &;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  &--theme-darker {
    background-color: $color-grey-transparent--15;
  }

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

  &--cart {
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

  &--checkout {
    padding-bottom: 2.5rem;

    #{$r}__heading {
      @include font-family(Poppins);
      font-size: 1.5rem;
      font-weight: 600;
      text-align: left;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-bottom: 0.5rem;
    }

    .cart-total {
      padding-top: 1.5rem;

      .block-separator {
        background-color: $color-grey-10;
      }

      &__line {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 400;
      }

      &__text {
        &--accent {
          font-size: 1.5rem;
        }
      }

      &__total {
        gap: 1rem;
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

.cart-promo {
  border: 1px solid $color-grey;
  border-radius: 6px;
  background-color: $color-white;
  padding: 2rem 1.5rem;
  margin: 1.5rem auto 0;
  max-width: min(610px, calc(100% - 2rem));

  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  align-items: center;
  width: auto;

  &__img-container {
    width: 4rem;
    height: 4rem;
    flex-shrink: 0;
  }

  &__img {
    object-fit: contain;
  }

  &__text-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__heading {
    @include font-family(Poppins);
    font-size: 1.125rem;
    font-weight: 600;
    color: $color-dark;
  }

  &__text {
    @include font-family(Inter);
    font-size: 0.75rem;
    color: $color-grey-13;
  }

  &__timer {
    display: inline-block;
    font-size: 0.75rem;
    width: auto;
    min-width: 4.5ch;

    :deep(.base-timer__time) {
      color: $color-red;
      text-align: center;
      width: 100%;
    }
  }
}
</style>
