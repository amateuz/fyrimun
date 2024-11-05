<script setup lang="ts">
interface BaseStockProps {
  stockLeft: number
}

defineProps<BaseStockProps>()
</script>

<template>
  <div class="base-stock">
    HURRY! ONLY
    <span class="base-stock__highlight">{{ stockLeft }}</span>
    LEFT IN STOCK.
  </div>
</template>

<style lang="scss" scoped>
.base-stock {
  @include font-family(Poppins);
  font-size: 1.5rem;

  color: $color-dark;

  &__highlight {
    color: $color-red--7;
  }
}
</style>
