import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProductView from '@/views/ProductView.vue'
import products from '@/constants/products.json'
import CartView from '@/views/CartView.vue'

const routes: RouteRecordRaw[] = []

products.forEach((product, index) => {
  routes.push({
    alias: index === 0 ? '/' : undefined,
    path: `/${product.url}`,
    name: product.url,
    component: ProductView,
    props: product
  })
})

routes.push({
  path: '/cart',
  name: 'cart',
  component: CartView
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
