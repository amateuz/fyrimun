import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProductView from '@/views/ProductView.vue'
import products from '@/constants/products.json'

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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
