import type { Option, Product } from '@/types'

export function getImageForColor(product: Product, color: Option): string {
  const colorImageMapEntry = product.colorImageMap.find(
    (map) => map[0] === color.value
  )
  return colorImageMapEntry ? colorImageMapEntry[1] : product.images[0]
}
