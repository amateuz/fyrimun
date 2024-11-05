<script setup lang="ts">
import menuData from '@/constants/mainMenu'
import Link from '@/components/Base/BaseLink.vue'
</script>

<template>
  <nav class="menu-main" role="navigation" aria-label="Main Menu">
    <ul class="menu-main__list">
      <li
        v-for="(menuItem, index) in menuData"
        :key="index"
        class="menu-main__item"
      >
        <Link :href="menuItem.href" class="menu-main__link">
          {{ menuItem.text }}
        </Link>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.menu-main {
  display: flex;
  flex-flow: column wrap;
  padding-inline: 1rem;

  font-size: 0.875rem;
  line-height: 1.375rem;

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-flow: column wrap;
    align-items: stretch;

    position: relative;
    flex-shrink: 0;

    &::before {
      display: none;
    }
  }

  &__link {
    @include font-family(Poppins);

    display: block;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border-radius: 0.5rem;

    font-size: 14px;
    text-transform: uppercase;
    text-decoration: none;

    color: color: $color-grey-5;

    transition: color 0.2s cubic-bezier(0, 0, 0.2, 1);

    &:hover {
      color: $color-dark;
    }
  }
}
</style>
