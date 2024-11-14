import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProductView from '@/views/ProductView.vue'
import products from '@/constants/products.json'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'

const routes: RouteRecordRaw[] = []

products.forEach((product, index) => {
  routes.push({
    alias: index === 0 ? '/' : undefined,
    path: `/${product.url}`,
    name: 'product',
    component: ProductView,
    props: product,
    meta: { title: product.name }
  })
})

routes.push(
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: { title: 'Cart Page' }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { title: 'Checkout Page' }
  }
)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to) => {
  document.title = (to.meta.title as string) ?? 'Fyrimun'
})

export default router
