<script setup lang="ts">
import type { Review as ReviewProps } from '@/types'
import { ref } from 'vue'
import ReviewRating from '@/components/Base/BaseRating.vue'

const props = defineProps<ReviewProps>()
const date = new Date(props.date)
const formattedDate = ref(date.toLocaleDateString('en-CA', { timeZone: 'UTC' }))
const formattedTime = ref(
  date.toLocaleTimeString('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
)
</script>

<template>
  <div class="base-review">
    <div class="base-review__name">{{ props.name }}</div>
    <ReviewRating class="base-review__rating" :rating="5" />
    <div class="base-review__date">{{ formattedDate }} {{ formattedTime }}</div>
    <div class="base-review__text">
      {{ props.text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-review {
  @include font-family(Inter);

  padding: 1rem 1.5rem 1.5rem 2.375rem;

  &__name {
    margin-bottom: 0.25rem;
  }

  &__name,
  &__date {
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 1.125rem;
  }

  &__name,
  &__text {
    color: hsl(228 40% 16%);
  }

  &__date {
    color: hsl(221 22% 56%);
    margin-top: 0.5rem;
  }

  &__rating {
    position: relative;
    display: inline-flex;
  }

  &__text {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>
