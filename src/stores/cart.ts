import type { CartProduct } from '@/types'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartProducts: [] as CartProduct[]
  }),

  getters: {
    totalQuantity: (state) =>
      state.cartProducts.reduce(
        (total, product) => total + product.quantity,
        0
      ),

    totalPrice: (state): number =>
      state.cartProducts.reduce(
        (total, product) => total + product.quantity * product.price,
        0
      ),

    totalProductQuantity: (state) => (cartProduct: CartProduct) => {
      const foundCartProduct = findCartProduct(state.cartProducts, cartProduct)
      return foundCartProduct ? foundCartProduct.quantity : 0
    }
  },

  actions: {
    addToCart(cartProductToAdd: CartProduct) {
      const existingProduct = findCartProduct(
        this.cartProducts,
        cartProductToAdd
      )
      if (existingProduct) {
        existingProduct.quantity += cartProductToAdd.quantity
      } else {
        this.cartProducts.push(cartProductToAdd)
      }
    },
    removeFromCart(cartProductToRemove: CartProduct) {
      this.cartProducts = this.cartProducts.filter(
        (cartProduct) => !equals(cartProduct, cartProductToRemove)
      )
    },
    updateQuantity(cartProduct: CartProduct, quantity: number) {
      const foundCartProduct = findCartProduct(this.cartProducts, cartProduct)
      if (!foundCartProduct) return
      foundCartProduct.quantity = quantity
    }
  },

  persist: true
})

function equals(cartProduct1: CartProduct, cartProduct2: CartProduct): boolean {
  return (
    cartProduct1.name === cartProduct2.name &&
    cartProduct1.color.value === cartProduct2.color.value &&
    cartProduct1.size.value === cartProduct2.size.value
  )
}

function findCartProduct(
  cartProducts: CartProduct[],
  cartProductToFind: CartProduct
): CartProduct | undefined {
  return cartProducts.find((cartProduct) =>
    equals(cartProduct, cartProductToFind)
  )
}
