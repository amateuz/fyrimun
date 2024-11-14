<script lang="ts" setup>
import type { CartProduct } from '@/types'
import { ref, computed, onBeforeMount } from 'vue'
import { useCartStore } from '@/stores/cart'
import { getLocalImageLoaders } from '@/utils/getLocalImageLoaders'
import SvgIcon from '@/components/Base/BaseSvgIcon.vue'
import Counter from '@/components/Base/BaseCounter.vue'
import Price from '@/components/Base/BasePrice.vue'
import CartCount from '@/components/Cart/CartCount.vue'
import { getFormattedPrice } from '@/utils/getFormattedPrice'

interface CartItemProps {
  isInteractive: boolean
  theme?: 'default' | 'darker'
}

const props = withDefaults(defineProps<CartItemProps>(), {
  isInteractive: true
})
const cartProduct = defineModel<CartProduct>('modelValue', { default: {} })
const cartStore = useCartStore()
const oldPrice = computed(() =>
  props.isInteractive
    ? getFormattedPrice(cartStore.totalProductOldPrice(cartProduct.value))
    : undefined
)

const productImageLoader = computed(() =>
  getLocalImageLoaders([cartProduct.value.image])
)
const productImagePath = ref<string | null>(null)

const loadProductImage = async () => {
  const loader = productImageLoader.value.get(cartProduct.value.image)
  if (!loader) {
    productImagePath.value = '/img/placeholder.png'
    return
  }
  try {
    const image = await loader.importFn()
    productImagePath.value = image.default
  } catch (error) {
    console.error('Failed to load image:', error)
    productImagePath.value = '/img/placeholder.png'
  }
}

onBeforeMount(() => {
  loadProductImage()
})

const removeItem = () => {
  cartStore.removeFromCart(cartProduct.value)
}
</script>

<template>
  <div
    :class="[
      'cart-item',
      { 'cart-item--non-interactive': !isInteractive },
      { [`cart-item--theme-${props.theme}`]: props.theme }
    ]"
  >
    <div class="cart-item__img-container">
      <img
        :src="productImagePath ?? '/img/placeholder.png'"
        alt="product image"
        class="cart-item__img"
      />
      <CartCount
        :count="cartStore.totalProductQuantity(cartProduct)"
        class="cart-item__cart-counter"
      />
    </div>
    <div class="cart-item__content">
      <div class="cart-item__content-row cart-item__content-row--top">
        <div class="cart-item__product-info">
          <div class="cart-item__name">
            {{ cartProduct.name }}
          </div>
          <div class="cart-item__variant">
            {{ cartProduct.color.label }}/{{ cartProduct.size.label }}
          </div>
        </div>
        <div v-if="props.isInteractive" class="cart-item__remove">
          <button class="cart-item__remove-button" @click="removeItem">
            <SvgIcon class="cart-item__remove-icon" name="cart-delete" />
          </button>
        </div>
      </div>
      <div class="cart-item__content-row cart-item__content-row--bottom">
        <div class="cart-item__actions">
          <!-- direct store access for simplicity -->
          <Counter
            v-if="props.isInteractive"
            v-model="cartProduct.quantity"
            class="cart-item__counter"
          />
          <Price
            :old-price="oldPrice"
            :price="getFormattedPrice(cartStore.totalProductPrice(cartProduct))"
            :show-discount="false"
            class="cart-item__price"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-item {
  $r: &;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;

  border-bottom: 1px solid $color-grey--15;

  &--non-interactive {
    align-items: center;
    gap: 1rem;
    padding-top: 0;
    padding-bottom: 0;
    border-bottom: none;

    #{$r}__img-container {
      width: 3.5rem;
      height: 3.5rem;
      border: none;
      border-radius: 0;
    }

    #{$r}__img {
      border-radius: 0;
      object-fit: contain;
    }

    #{$r}__cart-counter {
      font-size: 0.75rem;
    }

    #{$r}__content {
      flex-direction: row;
    }

    #{$r}__price {
      font-size: 1rem;
    }
  }

  &--theme-darker {
    #{$r}__variant {
      color: $color-grey-10;
    }

    #{$r}__cart-counter {
      background-color: $color-dark;
    }
  }

  &__img-container {
    width: 52px;
    height: 52px;
    border: 1px solid $color-grey--1;
    border-radius: 0.5rem;
    flex-shrink: 0;

    position: relative;
  }

  &__img {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    object-fit: cover;
  }

  &__cart-counter {
    width: 20px;
    height: 20px;

    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);

    font-size: 0.875rem;
    line-height: 1.25rem;

    background-color: $color-red--7;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-grow: 1;
  }

  &__content-row {
    display: flex;
    gap: 1rem;
  }

  &__product-info {
    @include font-family(Poppins);

    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.25rem;
  }

  &__name {
    font-size: 1rem;
    font-weight: 400;
    text-align: left;

    color: $color-dark;
  }

  &__variant {
    font-size: 0.875rem;
    font-weight: 400;
    text-align: left;

    color: $color-grey-5;
  }

  &__remove {
    flex-shrink: 0;

    padding: 0.375rem;
  }

  &__remove-icon {
    width: 24px;
    height: 24px;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &__counter {
    :deep(.base-counter__decrement),
    :deep(.base-counter__increment) {
      width: 32px;
    }

    :deep(.base-counter__quantity) {
      width: 34px;
    }

    width: fit-content;
    height: 2.25rem;

    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
  }

  &__price {
    gap: 0.25rem;

    font-size: 0.875rem;

    color: $color-dark;
  }
}
</style>
