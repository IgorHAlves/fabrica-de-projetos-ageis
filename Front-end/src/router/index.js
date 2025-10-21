import ProductCreateView from '@/views/ProductCreateView.vue'
import ProductView from '@/views/ProductView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CarrinhoView from '../views/CarrinhoView.vue'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/product',
            name: 'produtos',
            component: ProductDetailView
        },

        {
            path: '/produtos',
            name: 'produtosLista',
            component: ProductView
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

    ],
})

export default router
