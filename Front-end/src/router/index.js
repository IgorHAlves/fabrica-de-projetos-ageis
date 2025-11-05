import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import SobreView from '../views/SobreView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import ProductCreateView from '../views/ProductCreateView.vue'
import CarrinhoView from '../views/CarrinhoView.vue'
import { getProductById } from '@/Services/ProductsService'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { breadcrumb: 'Pagina Inicial' }
    },

    {
      path: '/sobre',
      name: 'sobre',
      component: SobreView,
      meta: { breadcrumb: 'Sobre' }
    },

    {
      path: '/produtos',
      name: 'produtos',
      component: ProductView,
      meta: { breadcrumb: 'Produtos' }
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: CarrinhoView,
      meta: { breadcrumb: 'Carrinho' }
    },
    {
      path: '/productDetail/:id',
      name: 'ProductDetail',
      component: ProductDetailView,
      props: true,
      meta: { breadcrumb: 'Detalhes do Produto' || ':id' }
    },
    {
      path: '/admin/produtos/novo',
      name: 'produtoNovo',
      component: ProductCreateView,
      meta: { breadcrumb: 'Criar Produto' }
    },
  ]
})

export default router
