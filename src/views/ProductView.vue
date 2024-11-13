<script lang="ts" setup>
import type { Product, Option, CartProduct } from '@/types'
import type { SwiperClass } from 'swiper/swiper-react'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useIntersectionObserver, until } from '@vueuse/core'
import { getImageForColor } from '@/utils/getImageForColor'
import { useCartStore } from '@/stores/cart'
import ProductCarousel from '@/components/Base/BaseCarousel.vue'
import ProductRating from '@/components/Base/BaseRating.vue'
import ProductPrice from '@/components/Base/BasePrice.vue'
import ProductStock from '@/components/Base/BaseStock.vue'
import ProductStats from '@/components/Base/BaseCustomerStats.vue'
import ProductViewersCount from '@/components/Base/BaseViewersCount.vue'
import ProductTimer from '@/components/Base/BaseTimer.vue'
import ProductHighlights from '@/components/Base/BaseList.vue'
import BlockSeparator from '@/components/Base/BaseSeparator.vue'
import SingleSelectGroup from '@/components/Base/BaseGroupSelect.vue'
import QuantitySelector from '@/components/Base/BaseCounter.vue'
import Button from '@/components/Base/BaseButton.vue'
import SvgIcon from '@/components/Base/BaseSvgIcon.vue'
import HtmlRendered from '@/components/Base/BaseRawHtmlRendered.vue'
import ProductReview from '@/components/Base/BaseReview.vue'
import ProductQuickAdd from '@/components/Base/BaseQuickWidget.vue'
import CartPopup from '@/components/Cart/CartPopup.vue'
import { useSideMenusStore } from '@/stores/sideMenus'
import Link from '@/components/Base/BaseLink.vue'

const product = defineProps<Product>()
const cartStore = useCartStore()
const cartProduct = ref<CartProduct>({
  name: product.name,
  color: product.colors[0],
  image: getImageForColor(product, product.colors[0]),
  oldPrice: product.oldPrice,
  price: product.price,
  size: product.sizes[0],
  quantity: 1
} as CartProduct)
const sideMenus = useSideMenusStore()

const carousel = ref<{ swiper: SwiperClass } | null>(null)
const addToCartButtonRef = ref<HTMLElement | null>(null)
const isQuickAddVisible = ref<boolean>(false)
const productTimerHeading = 'SALE ENDING IN'
const productTimerEndText = 'HURRY UP. THIS DEAL WILL END SOON!!'

const getSlideToIndex = (color: Option) => {
  const foundMap = product.colorImageMap.find((map) => map[0] === color.value)
  if (!foundMap) return null
  const productImageSrc = foundMap[1]
  const productImageSlideNumber = product.images.indexOf(productImageSrc)
  return productImageSlideNumber >= 0 ? productImageSlideNumber : null
}

const adjustCarouselToSelectedColor = async (color: Option | null) => {
  if (color === null) return
  const slideToIndex = getSlideToIndex(color)
  if (!slideToIndex) return
  await until(carousel.value!.swiper).not.toBe(null)
  carousel.value!.swiper.slideTo(slideToIndex)
}

const addToCartClick = () => {
  // add new object to a cart
  cartStore.addToCart(Object.assign({}, cartProduct.value))
  sideMenus.openCart()
}

const isControlsDisabled = computed(() => {
  return (
    cartProduct.value.color === null ||
    cartProduct.value.size === null ||
    cartProduct.value.quantity < 1
  )
})

watch(
  () => cartProduct.value.color,
  (newColor) => {
    if (newColor === null) return
    cartProduct.value.image = getImageForColor(product, newColor)
  }
)

const { stop: stopMiniCartObserver } = useIntersectionObserver(
  addToCartButtonRef,
  ([entry]) => {
    isQuickAddVisible.value = entry.boundingClientRect.top < 0
  },
  {
    root: null,
    threshold: [0, 1]
  }
)

onUnmounted(() => {
  stopMiniCartObserver()
})
</script>

<template>
  <section class="product-view">
    <ProductCarousel
      ref="carousel"
      :image-paths="product.images"
      class="product-view__carousel"
    />
    <section class="product-view__product-info">
      <div class="product-view__rating">
        <ProductRating
          :rating="product.rating ?? 5"
          :ratingsCount="product.ratingCount"
        >
          Rated
        </ProductRating>
      </div>
      <div class="product-view__product-info-header">
        <h3 class="product-view__heading product-view__heading--h3">
          {{ product.name }}
        </h3>
        <ProductPrice
          :oldPrice="product.oldPrice"
          :price="product.price"
          show-discount
        />
      </div>
      <BlockSeparator class="product-view__heading-separator" />
      <div class="product-view__deal">
        <ProductStock :stockLeft="product.stockLeft" />
        <ProductStats
          :customerPercentage="product.happyCustomerPercentage"
          :itemsPerCustomer="product.itemsPerCustomer"
        />
        <ProductViewersCount />
        <div class="product-view__timer-container">
          <h5 class="product-view__heading product-view__heading--h5">
            {{ productTimerHeading }}
          </h5>
          <ProductTimer
            class="product-view__timer"
            :show-progress-bar="true"
            :time-is-up-text="productTimerEndText"
          />
        </div>
      </div>
      <ProductHighlights :items="product.highlights" />
      <div class="product-view__product-info-footer">
        <div class="product-view__filters">
          <SingleSelectGroup
            v-model="cartProduct.color"
            :options="product.colors"
            groupLabel="Colour"
            @select="adjustCarouselToSelectedColor"
          />
          <SingleSelectGroup
            v-model="cartProduct.size"
            :options="product.sizes"
            groupLabel="Size"
          />
        </div>
        <div class="product-view__buttons-container">
          <div class="product-view__quantity-selector-container">
            <QuantitySelector v-model="cartProduct.quantity" />
          </div>
          <Button
            ref="addToCartButtonRef"
            :disabled="isControlsDisabled"
            class="product-view__button product-view__button--trolley"
            @click="addToCartClick"
          >
            <SvgIcon name="trolley" />
            ADD TO CART
          </Button>
          <Link
            :disabled="isControlsDisabled"
            class="product-view__button product-view__button--wallet"
            to="/checkout"
            type="accent"
          >
            <SvgIcon name="wallet" />
            BUY NOW
          </Link>
        </div>
        <img
          alt="Safe Checkout"
          class="product-view__safe-checkout"
          src="@/assets/img/safe-checkout.webp"
        />
      </div>
    </section>
    <section class="product-view__description">
      <h3
        class="product-view__heading product-view__heading--h3 product-view__heading--section"
      >
        Description
      </h3>
      <div class="product-view__wysiwyg-content">
        <HtmlRendered
          v-if="product.description"
          :htmlContent="product.description"
        />
      </div>
    </section>
    <section class="product-view__reviews-section">
      <h3
        class="product-view__heading product-view__heading--h3 product-view__heading--section"
      >
        Review
      </h3>
      <div class="product-view__reviews">
        <template
          v-for="(review, index) in product.reviews"
          :key="`review${index}`"
        >
          <ProductReview v-bind="review" />
          <BlockSeparator />
        </template>
      </div>
    </section>
    <Transition name="fade">
      <CartPopup
        v-if="cartStore.totalQuantity > 0"
        class="product-view__cart-popup"
        @click="sideMenus.openCart"
      />
    </Transition>
    <Teleport to="#app">
      <ProductQuickAdd
        v-if="isQuickAddVisible"
        v-model="cartProduct"
        class="product-view__quick-add"
        v-bind="product"
        @addButtonClick="addToCartClick"
      />
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
.product-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1rem 0.625rem;

  &__product-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0 0 1.5rem 0;
  }

  &__product-info-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__heading {
    @include font-family(Poppins);
    display: block;
    overflow-wrap: break-word;
    text-align: left;

    &--h3 {
      font-size: 2rem;
      font-weight: 600;
      line-height: 2.5rem;
      color: $color-dark-20;
    }

    &--h5 {
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 1rem;
      color: $color-dark;
    }

    &--section {
      padding-top: 0.875rem;
      padding-bottom: 0.625rem;

      color: $color-dark;
    }
  }

  &__heading-separator {
    margin: 1.25rem 0;
  }

  &__deal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__product-info-footer {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__timer-container {
    max-width: 400px;
  }

  &__timer {
    @include font-family(Poppins);
    font-size: 1rem;
    font-weight: 400;
    color: $color-dark;
  }

  &__filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__quantity-selector-container {
    width: 168px;
    height: 50px;
  }

  &__buttons-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;
  }

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 12px;
    height: 50px;
    border-radius: 0.25em;
    width: 100%;

    color: white;
    fill: white;

    &[disabled]:not([disabled='false']) {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .svg-icon {
      display: block;
      width: 24px;
      height: 24px;
    }

    &--trolley {
      background-color: $color-dark-25;

      &:hover {
        background-color: $color-grey-transparent--20;
      }
    }

    &--wallet {
      background-color: $color-red--5;
      stroke: $color-white;

      &:hover {
        background-color: $color-red--10;
      }
    }
  }

  &__safe-checkout {
    aspect-ratio: auto;
    object-fit: cover;

    width: fit-content;
    border-radius: 0.5rem;
  }

  &__description {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
  }

  &__wysiwyg-content {
    padding: 0.625rem 0;
  }

  &__reviews-section {
    padding-top: 1.125rem;
  }

  &__reviews {
    padding-top: 1.625rem;
  }

  &__quick-add {
    position: sticky;
    bottom: 0;
    left: 0;
  }

  &__cart-popup {
    position: fixed;
    bottom: 160px;
    right: 2rem;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s $ease-in-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
