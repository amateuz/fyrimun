<script setup lang="ts">
import { type Link as LinkType } from '@/types'
import Button from '@/components/Base/BaseButton.vue'
import Link from '@/components/Base/BaseLink.vue'
import { footerData } from '@/constants/footerData'
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__top">
      <Link href="/" class="app-footer__link">
        <img
          alt="logo"
          class="app-footer__logo"
          src="@/assets/img/logo-compressed.webp"
        />
      </Link>
      <div class="app-footer__email">{{ footerData.contactEmail }}</div>
    </div>

    <div
      v-for="(section, index) in footerData.sections"
      :key="index"
      class="app-footer__link-section"
    >
      <div class="app-footer__heading">{{ section.heading }}</div>
      <div class="app-footer__link-container">
        <template v-for="(link, linkIndex) in section.links">
          <Link
            v-if="!link.type"
            :key="`footer-link-${linkIndex}`"
            :href="link.href"
            class="app-footer__link"
          >
            {{ link.text }}
          </Link>

          <Button
            v-else
            :href="link.href"
            :key="`footer-button-${linkIndex}`"
            :type="(link as LinkType).type"
            tag="a"
            class="app-footer__link app-footer__link--button"
          >
            {{ link.text }}
          </Button>
        </template>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  @include font-family(Poppins);

  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2.25rem 1rem 3.5rem;

  background-color: $color-dark-3;

  &__top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  &__email {
    font-size: 0.875rem;
    line-height: 1.375rem;
    text-align: left;

    color: $color-white;
  }

  &__link-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__heading {
    font-size: 1.125rem;
    line-height: 1.625rem;

    color: $color-white;
  }

  &__link-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__link {
    font-size: 0.875rem;
    font-weight: 500;

    color: $color-white;

    &:hover {
      text-decoration: underline;
    }

    &--button {
      padding: 0.5rem 1.5rem;
      width: fit-content;
      height: auto;
      border-radius: 4px;

      font-weight: 400;
      line-height: 1.375rem;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
