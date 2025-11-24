<template>
  <!-- Card de pedido -->
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4"
    :class="statusBorderColor">
    <div class="flex items-start justify-between mb-4">
      <!-- Informações do pedido -->
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-lg font-bold text-gray-900">Pedido #{{ orderNumber }}</h3>
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="statusBadgeClass">
            {{ statusText }}
          </span>
        </div>
        
        <p class="text-sm text-gray-600 mb-1">
          <i class="fa-solid fa-calendar mr-2"></i>
          {{ formatDate(order.createdAt) }}
        </p>
        
        <p v-if="order.customerName" class="text-sm text-gray-600">
          <i class="fa-solid fa-user mr-2"></i>
          {{ order.customerName }}
        </p>
      </div>

      <!-- Valor total -->
      <div class="text-right">
        <p class="text-sm text-gray-500 mb-1">Total</p>
        <p class="text-2xl font-bold text-gray-900">R$ {{ formatPrice(order.total) }}</p>
      </div>
    </div>

    <!-- Itens do pedido (resumo) -->
    <div class="mb-4 pb-4 border-b border-gray-200">
      <p class="text-sm text-gray-600">
        <i class="fa-solid fa-box mr-2"></i>
        {{ order.itemCount || order.items?.length || 0 }} {{ order.itemCount === 1 ? 'item' : 'itens' }}
      </p>
    </div>

    <!-- Ações -->
    <div class="flex gap-2">
      <router-link
        :to="`/admin/orders/${order.id}`"
        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-center font-semibold text-sm">
        <i class="fa-solid fa-eye mr-2"></i>
        Ver Detalhes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

// Número do pedido (primeiros 8 caracteres do ID)
const orderNumber = computed(() => {
  return props.order.id?.substring(0, 8).toUpperCase() || 'N/A'
})

// Status do pedido (mock - ajustar conforme API)
const statusText = computed(() => {
  return props.order.status || 'Pendente'
})

// Classe CSS do badge de status
const statusBadgeClass = computed(() => {
  const status = props.order.status?.toLowerCase() || 'pending'
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

// Cor da borda baseada no status
const statusBorderColor = computed(() => {
  const status = props.order.status?.toLowerCase() || 'pending'
  const colors = {
    'pending': 'border-yellow-500',
    'pendente': 'border-yellow-500',
    'processing': 'border-blue-500',
    'processando': 'border-blue-500',
    'shipped': 'border-purple-500',
    'enviado': 'border-purple-500',
    'delivered': 'border-green-500',
    'entregue': 'border-green-500',
    'cancelled': 'border-red-500',
    'cancelado': 'border-red-500'
  }
  return colors[status] || 'border-gray-500'
})

// Formata preço
function formatPrice(price) {
  if (!price && price !== 0) return '0.00'
  return Number(price).toFixed(2)
}

// Formata data
function formatDate(date) {
  if (!date) return 'Data não disponível'
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
