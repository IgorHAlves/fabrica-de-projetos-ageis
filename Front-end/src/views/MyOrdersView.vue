<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-5xl font-extrabold mb-4">Meus Pedidos</h1>
        <p class="text-xl text-blue-100">Acompanhe o status de suas compras</p>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Carregando seus pedidos...</p>
      </div>

      <!-- Lista de pedidos -->
      <div v-else-if="myOrders.length > 0" class="space-y-6">
        <div
          v-for="order in myOrders"
          :key="order.id"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <!-- Header do pedido -->
          <div class="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h2 class="text-2xl font-bold text-gray-900">
                  Pedido #{{ order.id.substring(0, 8).toUpperCase() }}
                </h2>
                <span
                  class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="getStatusBadgeClass(order.status)">
                  {{ order.status || 'Pendente' }}
                </span>
              </div>
              <p class="text-gray-600">
                <i class="fa-solid fa-calendar mr-2"></i>
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            
            <div class="text-right">
              <p class="text-sm text-gray-500 mb-1">Total</p>
              <p class="text-3xl font-bold text-blue-600">R$ {{ formatPrice(order.total) }}</p>
            </div>
          </div>

          <!-- Itens do pedido -->
          <div class="space-y-4 mb-6">
            <h3 class="font-bold text-gray-900 mb-3">
              <i class="fa-solid fa-box mr-2"></i>
              Itens ({{ order.items?.length || 0 }})
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  :src="item.imageUrl || 'https://via.placeholder.com/60'"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-lg" />
                
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ item.name }}</p>
                  <p class="text-sm text-gray-600">Qtd: {{ item.quantity }} x R$ {{ formatPrice(item.price) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="flex gap-3">
            <router-link
              :to="`/my-orders/${order.id}`"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors text-center font-semibold">
              <i class="fa-solid fa-eye mr-2"></i>
              Ver Detalhes
            </router-link>
            
            <button
              v-if="order.trackingCode"
              class="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
              <i class="fa-solid fa-truck mr-2"></i>
              Rastrear Pedido
            </button>
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-center gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
              <i class="fa-solid fa-chevron-left mr-2"></i>
              Anterior
            </button>
            
            <span class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
              Próxima
              <i class="fa-solid fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
        <i class="fa-solid fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Você ainda não fez nenhum pedido</h3>
        <p class="text-gray-600 mb-6">Explore nossos produtos e faça sua primeira compra!</p>
        <router-link
          to="/produtos"
          class="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
          <i class="fa-solid fa-store mr-2"></i>
          Ver Produtos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getOrders } from '../Services/OrdersService'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()
const isLoading = ref(false)
const myOrders = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const totalOrders = ref(0)

const totalPages = computed(() => {
  return Math.ceil(totalOrders.value / pageSize.value)
})

function getStatusBadgeClass(status) {
  const statusLower = status?.toLowerCase() || 'pending'
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'pendente': 'bg-yellow-100 text-yellow-700',
    'processing': 'bg-blue-100 text-blue-700',
    'processando': 'bg-blue-100 text-blue-700',
    'shipped': 'bg-purple-100 text-purple-700',
    'enviado': 'bg-purple-100 text-purple-700',
    'delivered': 'bg-green-100 text-green-700',
    'entregue': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700',
    'cancelado': 'bg-red-100 text-red-700'
  }
  return classes[statusLower] || 'bg-gray-100 text-gray-700'
}

function formatPrice(price) {
  if (!price && price !== 0) return '0.00'
  return Number(price).toFixed(2)
}

function formatDate(date) {
  if (!date) return 'Data não disponível'
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

async function loadMyOrders() {
  isLoading.value = true
  
  try {
    // TODO: Quando autenticação estiver pronta, filtrar por user.id
    const data = await getOrders(currentPage.value, pageSize.value)
    myOrders.value = data.items || []
    totalOrders.value = data.totalCount || 0
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error)
    myOrders.value = []
  } finally {
    isLoading.value = false
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadMyOrders()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadMyOrders()
  }
}

onMounted(() => {
  loadMyOrders()
})
</script>
