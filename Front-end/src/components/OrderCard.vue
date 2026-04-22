<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group">
    <!-- Header do Card -->
    <div class="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
          <i class="fa-solid fa-receipt text-lg"></i>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Pedido</p>
          <h3 class="text-lg font-bold text-gray-900">#{{ orderNumber }}</h3>
        </div>
      </div>
      
      <div v-if="order.createdAt" class="text-right">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Data</p>
        <p class="text-sm font-semibold text-gray-700">{{ formatDate(order.createdAt) }}</p>
      </div>
    </div>

    <!-- Corpo do Card -->
    <div class="p-5">
      <!-- Prévia dos Produtos -->
      <div v-if="orderItems.length > 0" class="mb-6">
        <p class="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">
          {{ orderItems.length }} {{ orderItems.length === 1 ? 'Item' : 'Itens' }}
        </p>
        <div class="flex -space-x-3 overflow-hidden py-1">
          <div 
            v-for="(item, index) in orderItems.slice(0, 4)" 
            :key="index"
            class="relative w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gray-100 flex-shrink-0"
            :title="item.productName">
            <img 
              :src="item.imageUrl || 'https://via.placeholder.com/150'" 
              :alt="item.productName"
              class="w-full h-full object-cover rounded-full"
              @error="$event.target.src='https://via.placeholder.com/150'" />
          </div>
          <div 
            v-if="orderItems.length > 4" 
            class="relative w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
            +{{ orderItems.length - 4 }}
          </div>
        </div>
      </div>
      <div v-else class="mb-6 py-2">
        <p class="text-sm text-gray-400 italic">Nenhum item listado</p>
      </div>

      <!-- Footer com Total -->
      <div class="flex items-end justify-between mt-4">
        <div>
          <p class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total</p>
          <p class="text-2xl font-bold text-gray-900">R$ {{ formatPrice(orderTotal) }}</p>
        </div>
      </div>
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

// Preço total (API retorna OrderPrice)
const orderTotal = computed(() => {
  return props.order.orderPrice || props.order.OrderPrice || 0
})

// Lista de produtos (API retorna Products)
const orderItems = computed(() => {
  return props.order.products || props.order.Products || []
})

// Formata preço
function formatPrice(price) {
  if (!price && price !== 0) return '0.00'
  return Number(price).toFixed(2)
}

// Formata data
function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
