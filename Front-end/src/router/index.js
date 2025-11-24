import { createRouter, createWebHistory } from 'vue-router'

import AdminCouponsView from '../views/AdminCouponsView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminOrdersView from '../views/AdminOrdersView.vue'
import AdminProductsDashboard from '../views/AdminProductsDashboard.vue'

import CarrinhoView from '../views/CarrinhoView.vue'
import HomeView from '../views/HomeView.vue'
import MyOrdersView from '../views/MyOrdersView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import ProductCreateView from '../views/ProductCreateView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import ProductView from '../views/ProductView.vue'
import SobreView from '../views/SobreView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', name: 'Home', component: HomeView },
        { path: '/sobre', name: 'Sobre', component: SobreView },
        { path: '/produtos', name: 'Produtos', component: ProductView },
        { path: '/carrinho', name: 'Carrinho', component: CarrinhoView },
        { path: '/productDetail/:id', name: 'ProductDetail', component: ProductDetailView, props: true },
        // Cliente
        { path: '/my-orders', name: 'MyOrders', component: MyOrdersView },
        { path: '/my-orders/:id', name: 'MyOrderDetail', component: OrderDetailView, props: true },
        // Admin
        { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboardView },
        { path: '/admin/orders', name: 'AdminOrders', component: AdminOrdersView },
        { path: '/admin/orders/:id', name: 'AdminOrderDetail', component: OrderDetailView, props: true },
        { path: '/admin/products', name: 'AdminProductsDashboard', component: AdminProductsDashboard },
        { path: '/admin/products/create', name: 'AdminProductCreate', component: ProductCreateView },
        { path: '/admin/coupons', name: 'AdminCoupons', component: AdminCouponsView },
        { path: '/admin/categories', name: 'AdminCategories', component: () => import('../views/AdminCategoriesView.vue') },
    ],
})

export default router
