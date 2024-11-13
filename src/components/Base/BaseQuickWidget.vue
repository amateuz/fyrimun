<script setup lang="ts">
import type { CartProduct, Product, Option } from '@/types'
import { computed, ref, watchEffect } from 'vue'
import Button from '@/components/Base/BaseButton.vue'
import Counter from '@/components/Base/BaseCounter.vue'
import Dropdown from '@/components/Base/BaseDropdown.vue'
import SvgIcon from '@/components/Base/BaseSvgIcon.vue'

const product = defineProps<Product>()
const cartProduct = defineModel<CartProduct>('modelValue', {
  default: {}
})
const emit = defineEmits<{ addButtonClick: [void] }>()

const getMergedOption = (
  colorOption: Option,
  sizeOption: Option
): Option | null => {
  if (colorOption === null || sizeOption === null) return null
  return {
    label: `${colorOption.label}/${sizeOption.label}`,
    value: `${colorOption.value}/${sizeOption.value}`
  }
}

const getMergedOptions = computed<Option[]>(() => {
  return product.colors.flatMap((colorOption) => {
    return product.sizes
      .map((sizeOption) => getMergedOption(colorOption, sizeOption))
      .filter((option) => option !== null)
  })
})

// cart product model
const selectedProductParams = ref<Option | null>(
  getMergedOption(cartProduct.value.color, cartProduct.value.size)
)
const selectedProductQuantity = ref<number>(cartProduct.value!.quantity)

const reviveMergedOption = (
  mergedOption: Option
): { color: Option; size: Option } => {
  const [colorLabel, sizeLabel] = mergedOption.label.split('/')
  const [colorValue, sizeValue] = mergedOption.value.split('/')

  return {
    color: { label: colorLabel, value: colorValue } as Option,
    size: { label: sizeLabel, value: sizeValue } as Option
  }
}

const addButtonClick = () => {
  emit('addButtonClick')
}

const isControlDisabled = computed<boolean>(() => {
  return (
    selectedProductParams.value === null || selectedProductQuantity.value < 1
  )
})

watchEffect(() => {
  const updatedParams: {
    color: Option | null
    size: Option | null
    quantity: number
  } = {
    color: null,
    size: null,
    quantity: selectedProductQuantity.value
  }
  if (selectedProductParams.value !== null) {
    const { color, size } = reviveMergedOption(selectedProductParams.value)
    updatedParams.color = color
    updatedParams.size = size
  }
  cartProduct.value = Object.assign(cartProduct.value, updatedParams)
})
</script>

<template>
  <div class="base-quick-widget">
    <Dropdown
      v-model="selectedProductParams"
      :options="getMergedOptions"
      class="base-quick-widget__dropdown"
    />
    <div class="base-quick-widget__controls">
      <Counter
        v-model="selectedProductQuantity"
        class="base-quick-widget__counter"
      />
      <Button
        class="base-quick-widget__button"
        type="accent"
        @click="addButtonClick"
        :disabled="isControlDisabled"
      >
        <SvgIcon name="cart" />
        ADD TO CART
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-quick-widget {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 1.25rem;
  border-color: $color-grey--15;

  z-index: $z-dropdown;

  background-color: $color-white;
  box-shadow: 0 2px 4px 4px $color-grey-transparent--10;

  transition-duration: 0.3s;
  transition-timing-function: $ease-in-out;
  overscroll-behavior: contain;

  &__dropdown {
    width: 100%;
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }

  &__counter,
  &__button {
    border-radius: 0;
  }

  &__button {
    gap: 0.5rem;

    &[disabled]:not([disabled='false']) {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .svg-icon {
      display: block;
      width: 24px;
      height: 24px;
    }
  }

  &__counter {
    height: auto;
  }
}
</style>
