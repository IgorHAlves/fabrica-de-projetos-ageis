<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Conteúdo principal -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Gerenciar Pedidos</h1>
        <p class="text-gray-600">Visualize e gerencie todos os pedidos do sistema</p>
      </div>

      <!-- Filtros e busca -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Busca -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-magnifying-glass mr-2"></i>
              Buscar pedido
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Digite o número do pedido ou nome do cliente..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="handleSearch" />
          </div>

          <!-- Filtro de status -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-filter mr-2"></i>
              Status
            </label>
            <select
              v-model="statusFilter"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Carregando pedidos...</p>
      </div>

      <!-- Lista de pedidos -->
      <div v-else-if="filteredOrders.length > 0">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" />
        </div>

        <!-- Paginação -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <p class="text-gray-600">
              Mostrando {{ filteredOrders.length }} de {{ totalOrders }} pedidos
            </p>
            
            <div class="flex gap-2">
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
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
        <i class="fa-solid fa-inbox text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
        <p class="text-gray-600">{{ searchQuery ? 'Tente ajustar os filtros de busca' : 'Ainda não há pedidos no sistema' }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import OrderCard from '../components/OrderCard.vue'
import { useDebounce } from '../composables/useDebounce'
import { getOrders } from '../Services/OrdersService'

// Estado
const isLoading = ref(false)
const orders = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalOrders = ref(0)

// Computed
const totalPages = computed(() => {
  return Math.ceil(totalOrders.value / pageSize.value)
})

const filteredOrders = computed(() => {
  let result = orders.value

  // Filtro de status
  if (statusFilter.value) {
    result = result.filter(order => 
      order.status?.toLowerCase() === statusFilter.value.toLowerCase()
    )
  }

  // Busca por texto
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => {
      const orderNumber = order.id?.substring(0, 8).toLowerCase() || ''
      const customerName = order.customerName?.toLowerCase() || ''
      return orderNumber.includes(query) || customerName.includes(query)
    })
  }

  return result
})

/**
 * Carrega pedidos da API
 */
async function loadOrders() {
  isLoading.value = true
  
  try {
    const data = await getOrders(currentPage.value, pageSize.value)
    orders.value = data.items || []
    totalOrders.value = data.totalCount || 0
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error)
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

/**
 * Busca com debounce
 */
const debouncedSearch = useDebounce(() => {
  currentPage.value = 1
  loadOrders()
}, 500)

function handleSearch() {
  debouncedSearch()
}

function handleFilterChange() {
  currentPage.value = 1
  loadOrders()
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadOrders()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadOrders()
  }
}

onMounted(() => {
  loadOrders()
})
</script>
