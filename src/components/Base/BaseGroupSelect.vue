<script setup lang="ts">
import type { Option } from '@/types'
import { onBeforeMount } from 'vue'

interface BaseGroupSelectOptions {
  options: Option[]
  groupLabel?: string
  preSelectedIndex?: number
}

const selectedOption = defineModel<Option | null>('modelValue', { default: {} })
const props = withDefaults(defineProps<BaseGroupSelectOptions>(), {
  preSelectedIndex: 0
})
const emit = defineEmits<{ select: [value: Option | null] }>()

const handleSelect = (option: Option) => {
  if (selectedOption.value?.value === option.value) {
    selectedOption.value = null
  } else {
    selectedOption.value = option
  }
  emit('select', option)
}

onBeforeMount(() => {
  if (
    props.preSelectedIndex !== undefined &&
    props.options[props.preSelectedIndex]
  )
    selectedOption.value = props.options[props.preSelectedIndex]
})
</script>

<template>
  <div class="base-group-selector">
    <h3 v-if="groupLabel" class="base-group-selector__label">
      {{ groupLabel }}
    </h3>
    <div class="base-group-selector__options">
      <button
        v-for="option in props.options"
        :key="option.value"
        :class="[
          'base-group-selector__option',
          {
            'base-group-selector__option--selected':
              selectedOption?.value === option.value
          }
        ]"
        @click="handleSelect(option)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-group-selector {
  @include font-family(Poppins);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  font-size: 0.875rem;

  &__label {
    font-size: 1.125rem;
    font-weight: 600;

    color: #1a2d48;
  }

  &__options {
    display: flex;
    flex-wrap: wrap;

    gap: 0.5rem;
  }

  &__option {
    padding: 0.5rem 0.625rem;
    border: 1px solid #d1d5da;
    border-radius: 0.25rem;

    font-size: 0.875rem;

    background-color: #fff;
    color: rgb(74 74 74);
    cursor: pointer;

    transition: all 0.3s $ease-in-out;

    &:hover {
      background-color: #e8eaed;
    }

    &--selected {
      background-color: rgb(251 197 7);

      &:hover {
        background-color: rgb(251 197 7);
      }
    }
  }
}
</style>
