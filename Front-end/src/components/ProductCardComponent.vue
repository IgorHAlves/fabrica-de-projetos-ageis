<template>
  <div class="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
    <router-link :to="`/productDetail/${product.id}`" class="block">
      <!-- Imagem do Produto -->
      <div class="relative overflow-hidden bg-gray-100">
        <img 
          :src="product.imageUrl || 'https://via.placeholder.com/400x400?text=Sem+Imagem'" 
          :alt="product.name"
          class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        <!-- Badge de Estoque (se tiver) -->
        <div v-if="product.stock !== undefined" class="absolute top-3 right-3">
          <span 
            v-if="product.stock > 0"
            class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Em estoque
          </span>
          <span 
            v-else
            class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Esgotado
          </span>
        </div>
      </div>

      <!-- Conteúdo do Card -->
      <div class="p-5">
        <!-- Nome do Produto -->
        <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {{ product.name }}
        </h2>

        <!-- Descrição -->
        <p class="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {{ product.description || 'Sem descrição disponível' }}
        </p>

        <!-- Preço e Botão -->
        <div class="flex items-center justify-between">
          <!-- Preço -->
          <div>
            <p class="text-sm text-gray-500">Preço</p>
            <p class="text-2xl font-bold text-blue-600">
              R$ {{ product.price.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </router-link>

    <!-- Botão Adicionar ao Carrinho -->
    <div class="px-5 pb-5">
      <button 
        @click.prevent="addToCart"
        :disabled="product.stock === 0"
        class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
        <i class="fa-solid fa-cart-plus"></i>
        <span>{{ product.stock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAlerts } from '../composables/useAlerts'
import { useCartStore } from '../stores/cart'

const props = defineProps(['product'])
const emit = defineEmits(['add'])
const { showSuccessToast, showError } = useAlerts()
const cartStore = useCartStore()

function addToCart(event) {
  event.preventDefault()
  event.stopPropagation()
  
  if (props.product.stock === 0) {
    showError('Produto esgotado', 'Este produto não está disponível no momento.')
    return
  }
  
  // Adiciona ao carrinho usando a store
  cartStore.addToCart(props.product)
  emit('add', props.product)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
