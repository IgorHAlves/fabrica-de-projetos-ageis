import { useAuth } from '@/composables/useAuth'
import { createRouter, createWebHistory } from 'vue-router'

// Views públicas
import CarrinhoView from '../views/CarrinhoView.vue'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import ProductView from '../views/ProductView.vue'
import SobreView from '../views/SobreView.vue'

// Views de categoria
import CategoryView from '@/views/CategoryView.vue'

// Views de produto (admin)
import ProductCreateView from '../views/ProductCreateView.vue'

// Views de cliente
import MyOrdersView from '../views/MyOrdersView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'

// Views de admin
import AdminCategoriesView from '../views/AdminCategoriesView.vue'
import AdminCouponsView from '../views/AdminCouponsView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminOrdersView from '../views/AdminOrdersView.vue'
import AdminProductsDashboard from '../views/AdminProductsDashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Redirect raíz para home
        {
            path: '/',
            redirect: '/home'
        },

        // ===== ROTAS PÚBLICAS =====
        {
            path: '/home',
            name: 'Home',
            component: HomeView,
            meta: { breadcrumb: 'Página Inicial' }
        },
        {
            path: '/sobre',
            name: 'Sobre',
            component: SobreView,
            meta: { breadcrumb: 'Sobre' }
        },
        {
            path: '/produtos',
            name: 'Produtos',
            component: ProductView,
            meta: { breadcrumb: 'Produtos' }
        },
        {
            path: '/productDetail/:id',
            name: 'ProductDetail',
            component: ProductDetailView,
            props: true,
            meta: { breadcrumb: 'Detalhes do Produto' }
        },
        {
            path: '/carrinho',
            name: 'Carrinho',
            component: CarrinhoView,
            meta: { breadcrumb: 'Carrinho' }
        },
        {
            path: '/categorias',
            name: 'Categorias',
            component: CategoryView,
            meta: { breadcrumb: 'Categorias' }
        },

        // ===== ROTAS DE CLIENTE (REQUER AUTENTICAÇÃO) =====
        {
            path: '/meus-pedidos',
            name: 'MyOrders',
            component: MyOrdersView,
            meta: {
                breadcrumb: 'Meus Pedidos',
                requiresAuth: true
            }
        },
        {
            path: '/meus-pedidos/:id',
            name: 'MyOrderDetail',
            component: OrderDetailView,
            props: true,
            meta: {
                breadcrumb: 'Detalhes do Pedido',
                requiresAuth: true
            }
        },

        // ===== ROTAS DE ADMIN (REQUER ADMIN) =====
        {
            path: '/admin/dashboard',
            name: 'AdminDashboard',
            component: AdminDashboardView,
            meta: {
                breadcrumb: 'Dashboard Admin',
                requiresAuth: true,
                requiredRole: 'admin'
            }
        },
        {
            path: '/admin/products',
            name: 'AdminProductsDashboard',
            component: AdminProductsDashboard,
            meta: {
                breadcrumb: 'Gerenciar Produtos',
                requiresAuth: true,
                requiredRole: 'admin'
            }
        },
        {
            path: '/admin/products/create',
            name: 'AdminProductCreate',
            component: ProductCreateView,
            meta: {
                breadcrumb: 'Criar Produto',
                requiresAuth: true,
                requiredRole: 'admin'
            }
        },
        {
            path: '/admin/orders',
            name: 'AdminOrders',
            component: AdminOrdersView,
            meta: {
                breadcrumb: 'Gerenciar Pedidos',
                requiresAuth: true,
                requiredRole: 'admin'
            }
        },
        {
            path: '/admin/orders/:id',
            name: 'AdminOrderDetail',
            component: OrderDetailView,
            props: true,
            meta: {
                breadcrumb: 'Detalhes do Pedido',
                requiresAuth: true,
                requiredRole: 'admin'
            }
        },
        {
            path: '/admin/coupons',
            name: 'AdminCoupons',
            component: AdminCouponsView,
            meta: {
                breadcrumb: 'Gerenciar Cupons',
                requiresAuth: true,
                requiredRole: 'admin'
            }
        },
        {
            path: '/admin/categories',
            name: 'AdminCategories',
            component: AdminCategoriesView,
            meta: {
                breadcrumb: 'Gerenciar Categorias',
                requiresAuth: true,
                requiredRole: 'admin'
            }
        },

        // Rotas antigas mantidas para compatibilidade (podem ser removidas depois)
        {
            path: '/admin/categorias/nova',
            redirect: '/admin/categories'
        },
        {
            path: '/admin/produtos/novo',
            redirect: '/admin/products/create'
        }
    ]
})

// Navigation Guard - Proteção de rotas
router.beforeEach((to, from, next) => {
    const { isLoggedIn, hasRole } = useAuth()

    // Verifica se a rota requer autenticação
    if (to.meta.requiresAuth) {
        if (!isLoggedIn.value) {
            // Usuário não autenticado - redireciona para login do Keycloak
            const keycloak = window._keycloak
            if (keycloak) {
                keycloak.login()
            } else {
                console.error('Keycloak não inicializado')
                next('/home')
            }
            return
        }

        // Verifica se a rota requer uma role específica
        if (to.meta.requiredRole) {
            const requiredRole = to.meta.requiredRole
            if (!hasRole(requiredRole)) {
                // Usuário não tem a role necessária
                console.warn(`Acesso negado. Role necessária: ${requiredRole}`)
                // Redireciona para home
                next('/home')
                return
            }
        }
    }

    // Permite navegação
    next()
})

export default router
