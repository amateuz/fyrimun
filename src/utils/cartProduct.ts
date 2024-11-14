import type { CartProduct } from '@/types'

export function equals(
  cartProduct1: CartProduct,
  cartProduct2: CartProduct
): boolean {
  return (
    cartProduct1.name === cartProduct2.name &&
    cartProduct1.color.value === cartProduct2.color.value &&
    cartProduct1.size.value === cartProduct2.size.value
  )
}

export function findCartProduct(
  cartProducts: CartProduct[],
  cartProductToFind: CartProduct
): CartProduct | undefined {
  return cartProducts.find((cartProduct) =>
    equals(cartProduct, cartProductToFind)
  )
}
