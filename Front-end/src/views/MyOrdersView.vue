<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
        <p class="text-gray-500 mt-2">Histórico de suas compras recentes</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-8">
        <OrderSkeleton v-for="i in 3" :key="i" />
      </div>

      <!-- Lista de pedidos -->
      <div v-else-if="myOrders.length > 0" class="space-y-8">
        <div
          v-for="order in myOrders"
          :key="order.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          
          <!-- Header do Card -->
          <div class="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <i class="fa-solid fa-receipt text-blue-600"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Pedido</p>
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Em andamento
                  </span>
                </div>
                <p class="text-sm font-bold text-gray-900 font-mono">#{{ order.id.substring(0, 8).toUpperCase() }}</p>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
              <p class="text-lg font-bold text-gray-900">R$ {{ formatPrice(order.orderPrice || order.OrderPrice) }}</p>
            </div>
          </div>

          <!-- Corpo do Card -->
          <div class="p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-box-open text-gray-400"></i>
              Itens do Pedido
            </h3>

            <!-- Grid de Produtos -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="item in getOrderProducts(order)"
                :key="item.id"
                class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                <!-- Imagem -->
                <div class="w-16 h-16 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    :src="item.imageUrl || 'https://via.placeholder.com/150'"
                    :alt="item.productName"
                    class="w-full h-full object-cover"
                    @error="$event.target.src='https://via.placeholder.com/150'" />
                </div>
                
                <!-- Info -->
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 truncate" :title="item.productName">
                    {{ item.productName }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    R$ {{ formatPrice(item.productPrice) }}
                  </p>
                </div>
              </div>
            </div>
            
            <div v-if="getOrderProducts(order).length === 0" class="text-center py-6 text-gray-400 italic text-sm">
              Nenhum item encontrado neste pedido.
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="flex justify-center pt-8">
          <nav class="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            
            <span class="px-4 text-sm font-medium text-gray-900">
              {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-bag-shopping text-3xl text-blue-500"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">Parece que você ainda não fez nenhuma compra. Explore nossa loja e aproveite as ofertas!</p>
        <router-link
          to="/produtos"
          class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
          Começar a comprar
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import OrderSkeleton from '../components/OrderSkeleton.vue'
import { useAuth } from '../composables/useAuth'
import { getOrders } from '../Services/OrdersService'

const { user } = useAuth()
const isLoading = ref(false)
const myOrders = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const totalOrders = ref(0)

const totalPages = computed(() => {
  return Math.ceil(totalOrders.value / pageSize.value)
})

function formatPrice(price) {
  if (!price && price !== 0) return '0.00'
  return Number(price).toFixed(2)
}

function getOrderProducts(order) {
  // API retorna "products" ou "Products"
  return order.products || order.Products || []
}

async function loadMyOrders() {
  isLoading.value = true
  
  try {
    const data = await getOrders(currentPage.value, pageSize.value)
    myOrders.value = data.items || []
    totalOrders.value = data.totalCount || data.totalItens || 0
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
