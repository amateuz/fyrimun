<script setup lang="ts">
import type { Properties } from 'csstype'
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useAnimationStore } from '@/stores/animation'

interface PanelSideProps {
  showOverlayOnOpen?: boolean
  position?: 'left' | 'right'
  width?: Properties['width']
  maxWidth?: Properties['maxWidth']
  transitionDuration?: Properties['transitionDuration']
  transitionEasing?: Properties['transitionTimingFunction']
}

const props = withDefaults(defineProps<PanelSideProps>(), {
  showOverlayOnOpen: true,
  position: 'left',
  width: '18rem',
  maxWidth: 'unset',
  transitionDuration: '0.3s',
  transitionEasing: 'cubic-bezier(.4,0,.2,1)'
})

const isOpened = defineModel<boolean>('modelValue')
const panelSideRef = ref(null)
const animation = useAnimationStore()

const panelSideComputedStyles = computed(() => ({
  transform: isOpened.value
    ? 'translateX(0)'
    : props.position === 'left'
      ? 'translateX(-100%)'
      : 'translateX(100%)',
  [props.position]: '0',
  transition: animation.isEnabled
    ? `transform ${props.transitionDuration} ${props.transitionEasing}`
    : 'none',
  width: props.width
}))

const closePanel = () => {
  isOpened.value = false
}
onClickOutside(panelSideRef, closePanel)

watch(
  () => props.showOverlayOnOpen && isOpened.value,
  (newVal) => {
    document.body.style.overflow = newVal ? 'hidden' : ''
  },
  { immediate: true }
)
</script>

<template>
  <aside
    ref="panelSideRef"
    :style="panelSideComputedStyles"
    aria-modal="true"
    class="panel-side"
    role="dialog"
  >
    <slot name="panel-side-top" :closePanel="closePanel" />
    <slot />
    <Teleport to="#app" v-if="props.showOverlayOnOpen">
      <Transition :name="animation.isEnabled ? 'fadeIn' : 'none'">
        <div v-if="isOpened" class="panel-side__overlay" />
      </Transition>
    </Teleport>
  </aside>
</template>

<style scoped lang="scss">
.panel-side {
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  position: fixed;
  top: 0;
  bottom: 0;
  z-index: $z-modal;

  background-color: $color-white;
  box-shadow:
    0 10px 15px -3px $color-grey-transparent--5,
    0 4px 6px -4px $color-grey-transparent--5;

  &__overlay {
    position: fixed;
    inset: 0;

    z-index: $z-overlay;

    background-color: $color-grey-transparent-20;
    cursor: default;

    overscroll-behavior: contain;
  }
}

/* transition */
.fadeIn-enter-active,
.fadeIn-leave-active {
  transition-property: background-color;
  transition-duration: 0.15s;
  transition-timing-function: $ease-in-out;
}

.fadeIn-enter-from,
.fadeIn-leave-to {
  background-color: transparent;
}

.fadeIn-leave-from,
.fadeIn-enter-to {
  background-color: $color-grey-transparent-20;
}
</style>
