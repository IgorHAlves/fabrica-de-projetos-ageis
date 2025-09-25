import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CarrinhoView from '../views/CarrinhoView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: HomeView
    },
    {
      path: '/product',
      name: 'produtos',
      component: ProductDetailView
    },

    {
      path: '/carrinho',
      name: 'carrinho',
      component: CarrinhoView
    }
    
  ],
})

export default router
