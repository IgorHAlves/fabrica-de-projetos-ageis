import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import ProductCreateView from '../views/ProductCreateView.vue'
import CarrinhoView from '../views/CarrinhoView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/produtos',
            name: 'produtos',
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
