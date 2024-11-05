<script setup lang="ts">
import type { Option } from '@/types'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import SvgIcon from '@/components/Base/BaseSvgIcon.vue'

interface DropdownProps {
  options: Option[]
}

defineProps<DropdownProps>()
const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedOption = defineModel<Option | null>('modelValue', {
  default: null
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
const closeDropdown = () => {
  isOpen.value = false
}
const isSelected = (option: Option) => {
  return selectedOption.value?.value === option.value
}
const selectOption = (option: Option) => {
  selectedOption.value = option
  closeDropdown()
}

onClickOutside(dropdownRef, closeDropdown)
</script>

<template>
  <div class="dropdown" ref="dropdownRef">
    <button @click="toggleDropdown" class="dropdown-toggle">
      {{ selectedOption?.label || 'Select variant' }}
      <span class="dropdown-toggle__icon-container">
        <SvgIcon class="dropdown-toggle__icon" name="arrow-down" />
      </span>
    </button>
    <Transition name="dropdown">
      <ul v-if="isOpen" class="dropdown-menu">
        <li
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="dropdown-item"
        >
          <div>
            {{ option.label }}
          </div>
          <div
            v-show="isSelected(option)"
            class="dropdown-item__icon-container"
          >
            <SvgIcon class="dropdown-item__icon" name="tick" />
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.dropdown {
  width: 100%;

  position: relative;
}

.dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;

  font-size: 0.875rem;

  background-color: white;
  cursor: pointer;

  &__icon-container {
    width: 20px;
    height: 20px;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;

    path {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.dropdown-menu {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  max-height: 340px;
  min-width: 8rem;
  border: 0.8px solid rgb(225 228 234);
  overflow: hidden auto;

  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: $z-dropdown;
  transform: translateY(0.25rem);

  line-height: 1.5rem;

  background-color: #fff;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -2px rgb(0 0 0 / 10%);
  color: rgb(15 23 42);
  list-style: none;

  overscroll-behavior: contain;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2.25rem 0.75rem 1rem;
  border-radius: 4px;

  position: relative;

  font-size: 0.875rem;
  line-height: 1.25rem;
  white-space: nowrap;

  cursor: pointer;

  &__icon-container {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    right: 0.5rem;
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: #fafafa;
    cursor: default;
  }
}

// transition
.dropdown-enter-active {
  transition: transform 0.15s $ease-in-out;
}

.dropdown-enter-from {
  transform: translateY(0);
}

.dropdown-enter-to {
  transform: translateY(0.25rem);
}

.dropdown-leave-from,
.dropdown-leave-to,
.dropdown-leave-active {
  transition: none;
}
</style>
