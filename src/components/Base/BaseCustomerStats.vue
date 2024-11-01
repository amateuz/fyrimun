<script setup lang="ts">
interface CustomerStatsProductProps {
  customerPercentage: number
  itemsPerCustomer: string
}

defineProps<CustomerStatsProductProps>()
</script>

<template>
  <div class="customer-stats">
    <span class="customer-stats__highlight">
      <strong>{{ customerPercentage }}%</strong>
    </span>
    customers buy
    <span class="customer-stats__highlight">
      <strong>{{ itemsPerCustomer }}</strong>
    </span>
    items to use daily and gifts for their beloved one
  </div>
</template>

<style lang="scss" scoped>
.customer-stats {
  @include font-family(Poppins);
  font-size: 1rem;

  color: #1a2d48;

  &__highlight {
    font-size: 1.25rem;
    font-weight: bolder;

    color: #eb403d;
  }
}
</style>
