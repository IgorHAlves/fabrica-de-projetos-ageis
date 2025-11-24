<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Conteúdo principal -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Visão geral do seu e-commerce</p>
      </div>

      <!-- Cards de estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Vendas"
          :value="stats.totalSales"
          prefix="R$ "
          icon="fa-solid fa-dollar-sign"
          iconColor="#10B981"
          iconBgColor="bg-green-100"
          borderColor="border-green-500"
          :change="12.5" />

        <StatsCard
          title="Pedidos"
          :value="stats.totalOrders"
          icon="fa-solid fa-shopping-bag"
          iconColor="#3B82F6"
          iconBgColor="bg-blue-100"
          borderColor="border-blue-500"
          :change="8.2" />

        <StatsCard
          title="Produtos"
          :value="stats.totalProducts"
          icon="fa-solid fa-box"
          iconColor="#8B5CF6"
          iconBgColor="bg-purple-100"
          borderColor="border-purple-500"
          :change="-2.4" />

        <StatsCard
          title="Clientes"
          :value="stats.totalCustomers"
          icon="fa-solid fa-users"
          iconColor="#F59E0B"
          iconBgColor="bg-yellow-100"
          borderColor="border-yellow-500"
          :change="15.3" />
      </div>

      <!-- Pedidos recentes -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            <i class="fa-solid fa-clock-rotate-left mr-2 text-blue-600"></i>
            Pedidos Recentes
          </h2>
          <router-link
            to="/admin/orders"
            class="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
            Ver todos
            <i class="fa-solid fa-arrow-right"></i>
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">Carregando pedidos...</p>
        </div>

        <!-- Lista de pedidos -->
        <div v-else-if="recentOrders.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OrderCard v-for="order in recentOrders" :key="order.id" :order="order" />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <i class="fa-solid fa-inbox text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg">Nenhum pedido encontrado</p>
        </div>
      </div>

      <!-- Ações rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link
          to="/admin/products"
          class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <i class="fa-solid fa-plus-circle text-4xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Novo Produto</h3>
          <p class="text-blue-100">Adicionar produto ao catálogo</p>
        </router-link>

        <router-link
          to="/admin/cupons"
          class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <i class="fa-solid fa-ticket text-4xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Gerenciar Cupons</h3>
          <p class="text-purple-100">Criar e editar cupons de desconto</p>
        </router-link>

        <router-link
          to="/admin/orders"
          class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <i class="fa-solid fa-list-check text-4xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Ver Pedidos</h3>
          <p class="text-green-100">Gerenciar todos os pedidos</p>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import OrderCard from '../components/OrderCard.vue'
import StatsCard from '../components/StatsCard.vue'
import { getOrders } from '../Services/OrdersService'
import { getProducts } from '../Services/ProductsService'

// Estado
const isLoading = ref(false)
const recentOrders = ref([])
const stats = ref({
  totalSales: '0.00',
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0
})

/**
 * Carrega dados do dashboard
 */
async function loadDashboardData() {
  isLoading.value = true
  
  try {
    // Busca pedidos recentes (primeiros 4)
    const ordersData = await getOrders(1, 4)
    recentOrders.value = ordersData.items || []
    
    // Calcula estatísticas
    stats.value.totalOrders = ordersData.totalCount || 0
    
    // Calcula total de vendas
    const totalSales = recentOrders.value.reduce((sum, order) => sum + (order.total || 0), 0)
    stats.value.totalSales = totalSales.toFixed(2)
    
    // Busca total de produtos
    const productsData = await getProducts(1, 1, '')
    stats.value.totalProducts = productsData.totalCount || 0
    
    // Mock de clientes (ajustar quando houver API)
    stats.value.totalCustomers = Math.floor(stats.value.totalOrders * 0.7)
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
