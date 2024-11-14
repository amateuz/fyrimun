import type { CartProduct } from '@/types'
import { defineStore } from 'pinia'
import { equals, findCartProduct } from '@/utils/cartProduct'

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
    },

    totalProductOldPrice: (state) => (cartProduct: CartProduct) => {
      const foundCartProduct = findCartProduct(state.cartProducts, cartProduct)
      return foundCartProduct
        ? foundCartProduct.quantity * (foundCartProduct.oldPrice || 0)
        : 0
    },

    totalProductPrice: (state) => (cartProduct: CartProduct) => {
      const foundCartProduct = findCartProduct(state.cartProducts, cartProduct)
      return foundCartProduct
        ? foundCartProduct.quantity * foundCartProduct.price
        : 0
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
    }
  },

  persist: true
})
