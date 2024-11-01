<script setup lang="ts">
import type { ListItem } from '@/types'
import SvgIcon from '@/components/Base/BaseSvgIcon.vue'

const props = defineProps<{ items: ListItem[] }>()
</script>

<template>
  <ul class="base-list">
    <li v-for="item in props.items" :key="item.icon" class="base-list__item">
      <div class="base-list__icon-container">
        <SvgIcon class="base-list__icon" :name="item.icon" />
      </div>
      <div class="base-list__text">{{ item.text }}</div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.base-list {
  @include font-family(Poppins);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 0.5rem 0;

  font-size: 0.875rem;

  color: #1a2d48;
  list-style: none;

  &__item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;
  }

  &__icon-container {
    flex: 1 0 1.5rem;
    width: 24px;
    height: 24px;
  }

  &__icon {
    fill: #48576d;
  }
}
</style>
