<script setup lang="ts">
import type { Product, Option, CartProduct } from '@/types'
import type { SwiperClass } from 'swiper/swiper-react'
import { onMounted, onUnmounted, ref } from 'vue'
import { useIntersectionObserver, until } from '@vueuse/core'
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
import BaseDebug from '@/components/Base/BaseDebug.vue'

const product = defineProps<Product>()
const cartProduct = ref<CartProduct>({
  color: product.colors[0],
  size: product.sizes[0],
  quantity: 1
} as CartProduct)

const carousel = ref<{ swiper: SwiperClass } | null>(null)
const addToCartButtonRef = ref<HTMLElement | null>(null)
const isQuickAddVisible = ref<boolean>(false)

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
    <BaseDebug>
      {{ cartProduct }}
    </BaseDebug>
    <ProductCarousel
      :image-paths="product.images"
      class="product-view__carousel"
      ref="carousel"
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
        <h3 class="product-view__heading">
          {{ product.name }}
        </h3>
        <ProductPrice :oldPrice="product.oldPrice" :price="product.price" />
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
          <ProductTimer />
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
            class="product-view__button product-view__button--trolley"
          >
            <SvgIcon name="trolley" />
            ADD TO CART
          </Button>
          <Button class="product-view__button product-view__button--wallet">
            <SvgIcon name="wallet" />
            BUY NOW
          </Button>
        </div>
        <img
          class="product-view__safe-checkout"
          alt="Safe Checkout"
          src="@/assets/img/safe-checkout.webp"
        />
      </div>
    </section>
    <section class="product-view__description">
      <h3 class="product-view__heading product-view__heading--section">
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
      <h3 class="product-view__heading product-view__heading--section">
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
    <Teleport to="#app">
      <ProductQuickAdd
        v-if="isQuickAddVisible"
        class="product-view__mini-cart"
        v-bind="product"
        v-model="cartProduct"
      />
    </Teleport>
  </section>
</template>

<style scoped lang="scss">
.product-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__product-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.5rem 0;
  }

  &__product-info-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__heading {
    @include font-family(Poppins);
    display: block;

    font-size: 32px;
    font-weight: 600;
    line-height: 40px;
    text-align: left;

    color: rgb(1 8 39);
    overflow-wrap: break-word;

    &--section {
      color: #1a2d48;
      padding-top: 0.875rem;
      padding-bottom: 0.625rem;
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
    color: white;
    fill: white;
    gap: 0.5rem;
    padding: 12px;
    height: 50px;
    border-radius: 0.25em;

    .svg-icon {
      display: block;
      width: 24px;
      height: 24px;
    }

    &--trolley {
      background-color: rgb(0, 21, 51);

      &:hover {
        background-color: rgba(51, 68, 92, 0.898);
      }
    }

    &--wallet {
      background-color: rgb(246, 82, 25);
      stroke: white;

      &:hover {
        background-color: #f87547;
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

  &__mini-cart {
    position: sticky;
    bottom: 0;
    left: 0;
  }
}
</style>
