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

const getMergedOption = (colorOption: Option, sizeOption: Option): Option => {
  return {
    label: `${colorOption.label}/${sizeOption.label}`,
    value: `${colorOption.value}/${sizeOption.value}`
  }
}

const getMergedOptions = computed((): Option[] => {
  return product.colors.flatMap((colorOption) => {
    return product.sizes.map((sizeOption) =>
      getMergedOption(colorOption, sizeOption)
    )
  })
})

// cart product model
const selectedProductParams = ref<Option>(
  getMergedOption(cartProduct.value!.color, cartProduct.value!.size)
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

watchEffect(() => {
  const { color, size } = reviveMergedOption(selectedProductParams.value)
  cartProduct.value = Object.assign(cartProduct.value, {
    color,
    size,
    quantity: selectedProductQuantity.value
  })
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
      <Button class="base-quick-widget__button" type="accent">
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
  background-color: #ffffff;
  z-index: $z-dropdown;
  overscroll-behavior: contain;

  border-color: hsl(220 17% 90%);
  box-shadow: 0 2px 4px 4px rgba(99, 99, 99, 0.2);
  padding-bottom: 1.25rem;
  transition-duration: 0.3s;
  transition-timing-function: $ease-in-out;

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
