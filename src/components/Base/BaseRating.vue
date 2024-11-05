<script setup lang="ts">
import type { Rating } from '@/types'
import RatingStar from '@/assets/img/icons/star.svg'

const props = defineProps<Rating>()
</script>

<template>
  <div class="base-rating">
    <div v-if="$slots.default" class="base-rating__text">
      <slot />
    </div>
    <div class="base-rating__rating">
      <RatingStar
        v-for="count in props.rating"
        :key="`rating${count}`"
        class="base-rating__star base-rating__star--gold"
      />
      <RatingStar
        v-for="count in 5 - props.rating"
        :key="`rating${count}`"
        class="base-rating__star base-rating__star--grey"
      />
    </div>
    <div v-if="ratingsCount" class="base-rating__quantity">
      ({{ props.ratingsCount }})
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-rating {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;

  color: $color-dark;

  &__rating {
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  &__star {
    width: 14px;
    height: 14px;

    &--gold {
      fill: $color-gold--5;
    }

    &--grey {
      fill: $color-grey-3;
    }
  }

  &__text,
  &__quantity {
    @include font-family(Poppins);
  }
}
</style>
