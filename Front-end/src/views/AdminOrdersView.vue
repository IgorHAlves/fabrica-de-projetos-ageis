<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Conteúdo principal -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
          <p class="text-gray-500 mt-1">Visualize e gerencie todos os pedidos do sistema</p>
        </div>
      </div>

      <!-- Filtros e busca -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div class="grid grid-cols-1 gap-4">
          <!-- Busca -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Buscar pedido
            </label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Digite o número do pedido..."
                class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                @input="handleSearch" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <OrderSkeleton v-for="i in 6" :key="i" />
      </div>

      <!-- Lista de pedidos -->
      <div v-else-if="filteredOrders.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
import OrderSkeleton from '../components/OrderSkeleton.vue'
import { useDebounce } from '../composables/useDebounce'
import { getOrders } from '../Services/OrdersService'

// Estado
const isLoading = ref(false)
const orders = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalOrders = ref(0)

// Computed
const totalPages = computed(() => {
  return Math.ceil(totalOrders.value / pageSize.value)
})

const filteredOrders = computed(() => {
  let result = orders.value

  // Busca por texto (apenas ID)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => {
      const orderNumber = order.id?.substring(0, 8).toLowerCase() || ''
      return orderNumber.includes(query)
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
