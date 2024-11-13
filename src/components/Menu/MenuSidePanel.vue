<script lang="ts" setup>
import SidePanel from '@/components/Base/BaseSidePanel.vue'
import IconClose from '@/assets/img/icons/close-menu.svg'
import MenuMain from '@/components/Menu/MenuMain.vue'
import { useSideMenusStore } from '@/stores/sideMenus'

const sideMenus = useSideMenusStore()
</script>

<template>
  <SidePanel
    v-model="sideMenus.isMenuOpened"
    :show-overlay-on-open="false"
    position="left"
  >
    <template #panel-side-top="{ closePanel }">
      <div class="panel-side-menu__top">
        <button
          aria-label="Close Panel"
          class="panel-side-menu__close-button"
          @click="closePanel"
        >
          <IconClose class="panel-side-menu__close-icon" />
        </button>
      </div>
    </template>
    <MenuMain />
  </SidePanel>
</template>

<style lang="scss" scoped>
.panel-side-menu {
  &__top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1.5rem 2rem 0.5rem;
  }

  &__close-button {
    padding: 0;
    border: none;

    background: none;
    cursor: pointer;
  }
}
</style>
