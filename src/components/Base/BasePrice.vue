<script setup lang="ts">
import { computed } from 'vue'

interface PriceProductProps {
  oldPrice?: number
  price: number
  showDiscount?: boolean
}

const props = defineProps<PriceProductProps>()

const discount = computed(() =>
  props.oldPrice
    ? Math.round((props.oldPrice - props.price) * (100 / props.oldPrice))
    : null
)
</script>
<template>
  <div class="base-price">
    <div v-if="oldPrice" class="base-price__old">
      {{ `${oldPrice}$` }}
    </div>
    <div class="base-price__new">{{ `${price}$` }}</div>
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

  color: rgb(72 147 91);

  &__old {
    text-decoration: line-through;

    color: rgb(8 23 12 / 49.8%);
  }

  &__discount {
    padding: 6px 8px;
    width: fit-content;
    border-radius: 6px;

    font-size: 18px;

    background-color: rgb(246 82 25);
    color: rgb(255 255 255);
  }
}
</style>
