import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarrinhoView from '../views/CarrinhoView.vue'
import ProductView from '../views/ProductView.vue'
import SobreView from '../views/SobreView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: HomeView
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: SobreView
    },

    {
      path: '/produtos',
      name: 'produtos',
      component: ProductView
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: CarrinhoView
    }

  ],
})

export default router
