<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'flex': isAdmin }">
    <!-- Sidebar (apenas para admin) -->
    <AdminSidebar v-if="isAdmin" />

    <!-- Conteúdo Principal -->
    <div :class="{ 'flex-1 p-8': isAdmin, 'py-8': !isAdmin }">
      <div class="max-w-7xl mx-auto" :class="{ 'px-0': isAdmin, 'px-4 sm:px-6 lg:px-8': !isAdmin }">
        <!-- Header com botão voltar -->
        <div class="mb-8">
          <router-link
            :to="backLink"
            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4">
            <i class="fa-solid fa-arrow-left"></i>
            {{ backText }}
          </router-link>
          
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            Detalhes do Pedido #{{ orderNumber }}
          </h1>
          <p class="text-gray-600">Informações completas do pedido</p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-40"></div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96"></div>
          </div>
          <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-64"></div>
          </div>
        </div>

        <!-- Conteúdo do pedido -->
        <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Coluna principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Informações do pedido -->
            <div v-if="(order.date || order.Date) || order.status" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-info-circle text-blue-500"></i>
                Informações do Pedido
              </h2>
              
              <div class="grid grid-cols-2 gap-4">
                <div v-if="order.date || order.Date">
                  <p class="text-sm text-gray-500 mb-1">Data do Pedido</p>
                  <p class="font-semibold text-gray-900">{{ formatDate(order.date || order.Date) }}</p>
                </div>
                
                <div v-if="order.status">
                  <p class="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                    :class="statusBadgeClass">
                    {{ order.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Itens do pedido -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="p-6 border-b border-gray-50">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i class="fa-solid fa-box text-blue-500"></i>
                  Itens do Pedido
                </h2>
              </div>
              
              <div class="divide-y divide-gray-50">
                <div
                  v-for="item in getOrderProducts(order)"
                  :key="item.id"
                  class="p-6 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                  <!-- Imagem do produto -->
                  <div class="w-20 h-20 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0">
                    <img
                      :src="item.imageUrl || 'https://via.placeholder.com/150'"
                      :alt="item.productName"
                      class="w-full h-full object-cover"
                      @error="$event.target.src='https://via.placeholder.com/150'" />
                  </div>
                  
                  <!-- Informações do item -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 text-lg mb-1 truncate">{{ item.productName }}</h3>
                    <p class="text-sm text-gray-500">Código: {{ item.id?.substring(0, 8).toUpperCase() }}</p>
                  </div>
                  
                  <!-- Preço -->
                  <div class="text-right">
                    <p class="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">Preço</p>
                    <p class="text-xl font-bold text-gray-900">
                      R$ {{ formatPrice(item.productPrice) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Coluna lateral -->
          <div class="space-y-6">
            <!-- Resumo do pedido -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 class="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Resumo do Pedido</h2>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-medium">R$ {{ formatPrice(order.orderPrice || order.OrderPrice) }}</span>
                </div>
                
                <div class="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                  <span class="font-bold text-gray-900 text-lg">Total</span>
                  <span class="font-bold text-blue-600 text-2xl">R$ {{ formatPrice(order.orderPrice || order.OrderPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Erro -->
        <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
          <i class="fa-solid fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Pedido não encontrado</h3>
          <p class="text-gray-600 mb-6">O pedido solicitado não existe ou foi removido</p>
          <router-link
            :to="backLink"
            class="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
            {{ backText }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderById } from '../Services/OrdersService'
import AdminSidebar from '../components/AdminSidebar.vue'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const { isAdmin } = useAuth()
const isLoading = ref(false)
const order = ref(null)

// Link de voltar dinâmico
const backLink = computed(() => {
  return isAdmin.value ? '/admin/orders' : '/meus-pedidos'
})

const backText = computed(() => {
  return isAdmin.value ? 'Voltar para gerenciamento' : 'Voltar para meus pedidos'
})

const orderNumber = computed(() => {
  return order.value?.id?.substring(0, 8).toUpperCase() || route.params.id?.substring(0, 8).toUpperCase() || 'N/A'
})

const statusBadgeClass = computed(() => {
  const status = order.value?.status?.toLowerCase() || 'pending'
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
  return classes[status] || 'bg-gray-100 text-gray-700'
})

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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getOrderProducts(order) {
  return order.products || order.Products || []
}

async function loadOrderDetails() {
  isLoading.value = true
  
  try {
    const orderId = route.params.id
    order.value = await getOrderById(orderId)
  } catch (error) {
    console.error('Erro ao carregar pedido:', error)
    order.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadOrderDetails()
})
</script>
