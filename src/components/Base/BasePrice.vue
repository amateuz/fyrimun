<script setup lang="ts">
import { computed } from 'vue'

interface PriceProductProps {
  oldPrice?: number | string
  price: number | string
  showDiscount?: boolean
}

const props = defineProps<PriceProductProps>()

const discount = computed(() => {
  const oldPrice =
    typeof props.oldPrice === 'string'
      ? parseFloat(props.oldPrice)
      : props.oldPrice
  const price =
    typeof props.price === 'string' ? parseFloat(props.price) : props.price
  return oldPrice && price
    ? Math.round((oldPrice - price) * (100 / oldPrice))
    : null
})
</script>
<template>
  <div class="base-price">
    <div v-if="oldPrice" class="base-price__old">
      {{ `$${oldPrice}` }}
    </div>
    <div class="base-price__new">{{ `$${price}` }}</div>
    <div v-if="oldPrice && showDiscount" class="base-price__discount">
      {{ `Save ${discount}%` }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.base-price {
  @include font-family(Poppins);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  font-size: 24px;
  font-weight: 400;

  color: $color-green;

  &__old {
    text-decoration: line-through;

    color: $color-grey-transparent-10;
  }

  &__discount {
    padding: 6px 8px;
    width: fit-content;
    border-radius: 6px;

    font-size: 1.125rem;

    background-color: $color-red--5;
    color: $color-white;
  }
}
</style>
