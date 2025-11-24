<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Conteúdo principal -->
    <main class="flex-1 p-8">
      <!-- Header com botão voltar -->
      <div class="mb-8">
        <router-link
          to="/admin/orders"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4">
          <i class="fa-solid fa-arrow-left"></i>
          Voltar para pedidos
        </router-link>
        
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Detalhes do Pedido #{{ orderNumber }}
        </h1>
        <p class="text-gray-600">Informações completas do pedido</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Carregando detalhes...</p>
      </div>

      <!-- Conteúdo do pedido -->
      <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informações do pedido -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              <i class="fa-solid fa-info-circle mr-2 text-blue-600"></i>
              Informações do Pedido
            </h2>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Data do Pedido</p>
                <p class="font-semibold text-gray-900">{{ formatDate(order.createdAt) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 mb-1">Status</p>
                <span
                  class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                  :class="statusBadgeClass">
                  {{ order.status || 'Pendente' }}
                </span>
              </div>
              
              <div v-if="order.customerName">
                <p class="text-sm text-gray-500 mb-1">Cliente</p>
                <p class="font-semibold text-gray-900">{{ order.customerName }}</p>
              </div>
              
              <div v-if="order.customerEmail">
                <p class="text-sm text-gray-500 mb-1">E-mail</p>
                <p class="font-semibold text-gray-900">{{ order.customerEmail }}</p>
              </div>
            </div>
          </div>

          <!-- Itens do pedido -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              <i class="fa-solid fa-box mr-2 text-blue-600"></i>
              Itens do Pedido
            </h2>
            
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <!-- Imagem do produto -->
                <img
                  :src="item.imageUrl || 'https://via.placeholder.com/80'"
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded-lg" />
                
                <!-- Informações do item -->
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600">Quantidade: {{ item.quantity }}</p>
                  <p class="text-sm text-gray-600">Preço unitário: R$ {{ formatPrice(item.price) }}</p>
                </div>
                
                <!-- Subtotal -->
                <div class="text-right">
                  <p class="text-sm text-gray-500">Subtotal</p>
                  <p class="text-lg font-bold text-gray-900">
                    R$ {{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna lateral -->
        <div class="space-y-6">
          <!-- Resumo do pedido -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Resumo</h2>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold">R$ {{ formatPrice(order.subtotal || order.total) }}</span>
              </div>
              
              <div v-if="order.discount" class="flex justify-between text-green-600">
                <span>Desconto</span>
                <span class="font-semibold">-R$ {{ formatPrice(order.discount) }}</span>
              </div>
              
              <div v-if="order.shipping" class="flex justify-between">
                <span class="text-gray-600">Frete</span>
                <span class="font-semibold">R$ {{ formatPrice(order.shipping) }}</span>
              </div>
              
              <div class="border-t pt-3 flex justify-between text-lg">
                <span class="font-bold text-gray-900">Total</span>
                <span class="font-bold text-blue-600">R$ {{ formatPrice(order.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Informações de entrega -->
          <div v-if="order.shippingAddress" class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">
              <i class="fa-solid fa-truck mr-2 text-blue-600"></i>
              Entrega
            </h2>
            
            <div class="text-gray-700 space-y-2">
              <p>{{ order.shippingAddress.street }}</p>
              <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}</p>
              <p>CEP: {{ order.shippingAddress.zipCode }}</p>
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
          to="/admin/orders"
          class="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
          Voltar para pedidos
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import { getOrderById } from '../Services/OrdersService'

const route = useRoute()
const isLoading = ref(false)
const order = ref(null)

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
