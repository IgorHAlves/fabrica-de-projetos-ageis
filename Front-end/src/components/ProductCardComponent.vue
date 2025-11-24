<template>
  <!-- Card de produto -->
  <div
    class="border rounded-lg p-4 shadow hover:shadow-lg transition-all duration-300 bg-white hover:-translate-y-2 hover:scale-105 flex flex-col h-full">

    <!-- Link para detalhes do produto (imagem e título) -->
    <router-link :to="`/productDetail/${product.id}`" class="flex-1 flex flex-col">
      <!-- Imagem do produto com lazy loading -->
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'" :alt="product.name"
          class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110" loading="lazy"
          decoding="async" @error="handleImageError" />
      </div>

      <!-- Nome do produto -->
      <h2 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
        {{ product.name }}
      </h2>

      <!-- Descrição do produto (limitada a 2 linhas) -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
        {{ product.description || 'Sem descrição disponível' }}
      </p>
    </router-link>

    <!-- Preço e botão de ação -->
    <div class="mt-auto pt-4 border-t border-gray-200">
      <!-- Preço -->
      <p class="text-blue-600 font-bold text-xl mb-4">
        R$ {{ formatPrice(product.price) }}
      </p>

      <!-- Botão de adicionar ao carrinho -->
      <button @click.stop="handleAddToCart"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Adicionar ao carrinho" :disabled="isOutOfStock">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
        </svg>
        <span v-if="!isOutOfStock">Adicionar ao Carrinho</span>
        <span v-else class="opacity-75">Sem estoque</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '../composables/useCart'

// Props do componente
const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (product) => {
      // Validação básica do produto
      return product && product.id && product.name && product.price !== undefined
    }
  }
})

// Usa o composable do carrinho diretamente
const { addToCart } = useCart()

// Computed para verificar se está sem estoque
const isOutOfStock = computed(() => {
  return props.product.stock !== undefined && props.product.stock <= 0
})

/**
 * Formata o preço para exibição
 * @param {Number} price - Preço do produto
 * @returns {String} Preço formatado
 */
function formatPrice(price) {
  if (!price && price !== 0) return '0.00'
  return Number(price).toFixed(2)
}

/**
 * Handler para erro ao carregar imagem
 */
function handleImageError(event) {
  // Substitui por placeholder em caso de erro
  event.target.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem'
}

/**
 * Handler para adicionar produto ao carrinho
 * Usa o composable useCart que já mostra mensagens de feedback
 * Não emite evento para evitar duplicação
 */
function handleAddToCart() {
  try {
    // Adiciona ao carrinho usando a store diretamente
    addToCart(props.product)
  } catch (error) {
    // Erro já é tratado pela store
  }
}
</script>

<style scoped>
/* Limita o texto a 2 linhas com ellipsis */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
