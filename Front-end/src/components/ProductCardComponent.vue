<template>
  <!-- Card de produto -->
  <div
    class="border rounded-lg p-3 shadow hover:shadow-lg transition-all duration-300 bg-white hover:-translate-y-2 hover:scale-105 flex flex-col h-full w-full">

    <!-- Link para detalhes do produto (imagem e título) -->
    <router-link :to="`/productDetail/${product.id}`" class="flex-1 flex flex-col">
      <!-- Imagem do produto com lazy loading -->
      <div class="relative overflow-hidden rounded-lg mb-2 bg-gray-50 aspect-[3/4]">
        <img :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'" :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy"
          decoding="async" @error="handleImageError" />
      </div>

      <!-- Nome do produto (limitado a 50 caracteres) -->
      <h2 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] mt-2">
        {{ truncateText(product.name, 50) }}
      </h2>

      <!-- Descrição do produto (limitada a 80 caracteres, 2 linhas) -->
      <p class="text-gray-600 text-sm mb-2 line-clamp-2 flex-1">
        {{ truncateText(product.description || 'Sem descrição disponível', 80) }}
      </p>

      <!-- Quantidade em estoque disponível -->
      <div class="mb-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="getStockClass(availableStock)">
          <i class="fa-solid fa-box mr-1"></i>
          Estoque: {{ product.stock !== undefined ? availableStock : 'Indisponível' }}
        </span>
      </div>
    </router-link>

    <!-- Preço e botão de ação -->
    <div class="mt-auto pt-3 border-t border-gray-200">
      <!-- Preço -->
      <p class="text-blue-600 font-bold text-xl mb-3">
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
const { addToCart, items: cartItems } = useCart()

/**
 * Calcula estoque disponível considerando quantidade no carrinho
 * @returns {Number} Estoque disponível
 */
const availableStock = computed(() => {
  if (props.product.stock === undefined) return Infinity

  // Encontra quantidade no carrinho
  const cartItem = cartItems.value.find(item => item.id === props.product.id)
  const inCartQuantity = cartItem ? cartItem.quantity : 0

  // Retorna estoque disponível
  return Math.max(0, props.product.stock - inCartQuantity)
})

// Computed para verificar se está sem estoque disponível
const isOutOfStock = computed(() => {
  return availableStock.value <= 0
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
 * Limita o texto a um número máximo de caracteres
 * @param {String} text - Texto a ser truncado
 * @param {Number} maxLength - Tamanho máximo
 * @returns {String} Texto truncado com "..." se necessário
 */
function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Retorna classe CSS baseada na quantidade de estoque
 * @param {Number} stock - Quantidade em estoque
 * @returns {String} Classe CSS
 */
function getStockClass(stock) {
  if (stock === undefined) return 'bg-gray-100 text-gray-600'
  if (stock <= 0) return 'bg-red-100 text-red-700'
  if (stock <= 5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
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
