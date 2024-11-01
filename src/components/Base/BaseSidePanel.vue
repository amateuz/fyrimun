<script setup lang="ts">
import type { Properties } from 'csstype'
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface PanelSideProps {
  viewOverlayOnOpen?: boolean
  position?: 'left' | 'right'
  width?: Properties['width']
  maxWidth?: Properties['maxWidth']
  transitionDuration?: Properties['transitionDuration']
  transitionEasing?: Properties['transitionTimingFunction']
}

const props = withDefaults(defineProps<PanelSideProps>(), {
  viewOverlayOnOpen: true,
  position: 'left',
  width: '18rem',
  maxWidth: 'unset',
  transitionDuration: '0.3s',
  transitionEasing: 'cubic-bezier(.4,0,.2,1)'
})

const isOpened = defineModel<boolean>('modelValue')

const panelSideRef = ref(null)

const PanelSideComputedStyles = computed(() => ({
  transform: isOpened.value
    ? 'translateX(0)'
    : props.position === 'left'
      ? 'translateX(-100%)'
      : 'translateX(100%)',
  [props.position]: '0'
}))

const closePanel = () => {
  isOpened.value = false
}

onClickOutside(panelSideRef, closePanel)

watch(
  () => props.viewOverlayOnOpen && isOpened.value,
  (newVal) => {
    document.body.style.overflow = newVal ? 'hidden' : ''
  },
  { immediate: true }
)
</script>

<template>
  <aside
    ref="panelSideRef"
    :style="PanelSideComputedStyles"
    aria-modal="true"
    class="panel-side"
    role="dialog"
  >
    <slot name="panel-side-top" :closePanel="closePanel" />
    <slot />
    <Teleport to="#app" v-if="props.viewOverlayOnOpen">
      <Transition name="fadeIn">
        <div v-if="isOpened" class="panel-side__overlay" />
      </Transition>
    </Teleport>
  </aside>
</template>

<style scoped lang="scss">
.panel-side {
  display: flex;
  flex-direction: column;
  width: v-bind('props.width');
  overflow-y: auto;

  position: fixed;
  top: 0;
  bottom: 0;
  z-index: $z-modal;

  background-color: #fff;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 10%),
    0 4px 6px -4px rgb(0 0 0 / 10%);

  transition-duration: v-bind('props.transitionDuration');
  transition-property: transform;
  transition-timing-function: v-bind('props.transitionEasing');

  &__overlay {
    overscroll-behavior: contain;
    position: fixed;
    cursor: default;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    transition: all 0.3s $ease-in-out;
    z-index: $z-overlay;
  }
}

/* transition */
.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: background-color 0.15s ease-in-out;
}

.fadeIn-enter-from,
.fadeIn-leave-to {
  background-color: transparent;
}

.fadeIn-leave-from,
.fadeIn-enter-to {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
