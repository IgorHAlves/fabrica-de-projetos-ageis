import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import SobreView from '../views/SobreView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: HomeView
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
    },
    {
      path: '/productDetail/:id',
      name: 'ProductDetail',
      component: ProductDetailView,
      props: true
    },
    {
      path: '/admin/produtos/novo',
      name: 'produtoNovo',
      component: ProductCreateView
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: CarrinhoView
    }
  ]
})

export default router
