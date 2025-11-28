<template>
  <!-- Estado de carregamento -->
  <div v-if="isLoading" class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p class="text-gray-600 text-lg font-semibold">Carregando produto...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Estado de erro -->
  <div v-else-if="error" class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <i class="fa-solid fa-exclamation-triangle text-6xl text-red-500 mb-6"></i>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Produto Não Encontrado</h1>
        <p class="text-gray-600 mb-8 text-lg">{{ error }}</p>
        <div class="flex gap-4 justify-center">
          <router-link to="/produtos"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <i class="fa-solid fa-arrow-left mr-2"></i>
            Voltar para Produtos
          </router-link>
          <router-link to="/home"
            class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
            <i class="fa-solid fa-home mr-2"></i>
            Ir para Home
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Página de detalhes do produto -->
  <div v-else-if="product" class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Botão voltar -->
      <div class="mb-6">
        <router-link to="/produtos"
          class="inline-flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors">
          <i class="fa-solid fa-arrow-left mr-2"></i>
          Voltar para produtos
        </router-link>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8">
          <!-- Imagem do produto -->
          <div class="lg:col-span-1 p-6 lg:p-8 flex justify-center items-start">
            <div class="relative group max-w-sm">
            <img :src="product.imageUrl || 'https://via.placeholder.com/600x600?text=Sem+Imagem'" :alt="product.name"
                class="w-full aspect-[3/4] object-contain group-hover:scale-105 transition-transform duration-300"
                loading="lazy" @error="handleImageError" />
              <div v-if="isOutOfStock"
                class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                Esgotado
              </div>
            </div>
          </div>

          <!-- Informações do produto -->
          <div class="lg:col-span-1 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <!-- Nome e categoria -->
              <div class="mb-4">
                <h1 class="text-4xl font-extrabold text-gray-900 mb-2">{{ product.name }}</h1>
                <p v-if="product.description" class="text-gray-600 text-lg leading-relaxed mb-6">
                  {{ product.description }}
                </p>
              </div>

              <!-- Preço -->
              <div class="mb-6">
                <p class="text-5xl font-extrabold text-blue-600 mb-2">
                  R$ {{ product.price ? product.price.toFixed(2) : '0.00' }}
                </p>
                <p class="text-sm text-gray-500">ou em até 10x sem juros</p>
              </div>

              <!-- Estoque -->
              <div class="mb-6">
                <div class="flex items-center space-x-3 mb-4">
                  <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold"
                    :class="getStockClass(availableStock)">
                    <i class="fa-solid fa-box mr-2"></i>
                    Estoque: {{ product.stock !== undefined ? availableStock : 'Indisponível' }}
                  </span>
                </div>

                <!-- Seletor de quantidade -->
                <div v-if="!isOutOfStock" class="mb-6">
                  <label class="block text-sm font-bold text-gray-900 mb-2">Quantidade</label>
                  <div class="flex items-center space-x-4">
                    <button @click="decreaseQuantity"
                      class="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 font-bold"
                      :disabled="quantity <= 1" aria-label="Diminuir quantidade">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="w-16 text-center font-bold text-2xl text-gray-900">{{ quantity }}</span>
                    <button @click="increaseQuantity"
                      class="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 font-bold"
                      :disabled="quantity >= availableStock" aria-label="Aumentar quantidade">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">Máximo disponível: {{ availableStock }} unidades</p>
                </div>
              </div>
            </div>

            <!-- Variações como pequenos quadros (se existirem) -->
            <div v-if="(variations && variations.length > 0) || parentProduct" class="mb-6">
              <label class="block text-sm font-bold text-gray-900 mb-3">
                <i class="fa-solid fa-layer-group mr-2 text-blue-600"></i>
                {{ parentProduct ? 'Produto Principal e Variações' : 'Variações Disponíveis' }}
              </label>
              <div class="flex flex-wrap gap-3">
                <!-- Produto Pai (quando estiver vendo uma variação) -->
                <router-link v-if="parentProduct"
                  :to="`/productDetail/${parentProduct.id}`"
                  class="relative cursor-pointer group border-2 rounded-lg p-3 transition-all duration-300 block"
                  :class="route.params.id === parentProduct.id
                    ? 'border-yellow-500 bg-yellow-50 shadow-lg scale-105' 
                    : 'border-yellow-300 bg-white hover:border-yellow-400 hover:shadow-md'">
                  <!-- Badge de produto principal -->
                  <div class="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    :class="route.params.id === parentProduct.id ? 'bg-yellow-600' : ''">
                    <i class="fa-solid fa-star text-xs"></i>
                  </div>
                  <!-- Imagem pequena -->
                  <div class="relative w-16 h-16 mx-auto mb-2 rounded overflow-hidden bg-gray-100">
                    <img :src="parentProduct.imageUrl || 'https://via.placeholder.com/100x100?text=Sem+Imagem'" 
                      :alt="parentProduct.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div v-if="parentProduct.stock === 0" 
                      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span class="text-white text-xs font-bold">Esgotado</span>
                    </div>
                  </div>
                  <!-- Nome -->
                  <p class="text-xs font-semibold text-gray-900 text-center mb-1 line-clamp-2">
                    {{ parentProduct.name }}
                  </p>
                  <!-- Badge Principal -->
                  <p class="text-xs font-bold text-yellow-600 text-center mb-1">
                    <i class="fa-solid fa-star mr-1"></i>
                    Principal
                  </p>
                  <!-- Preço -->
                  <p class="text-sm font-bold text-blue-600 text-center">
                    R$ {{ parentProduct.price ? parentProduct.price.toFixed(2) : '0.00' }}
                  </p>
                  <!-- Estoque pequeno -->
                  <div class="flex justify-center mt-1">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                      :class="parentProduct.stock === 0 ? 'bg-red-100 text-red-700' : 
                             parentProduct.stock < 5 ? 'bg-yellow-100 text-yellow-700' : 
                             'bg-green-100 text-green-700'">
                      {{ parentProduct.stock !== undefined ? parentProduct.stock : 'N/A' }}
                    </span>
                  </div>
                </router-link>

                <!-- Variações -->
                <router-link v-for="variation in variations" :key="variation.id"
                  :to="`/productDetail/${variation.id}`"
                  class="relative cursor-pointer group border-2 rounded-lg p-3 transition-all duration-300 block"
                  :class="route.params.id === variation.id
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'">
                  <!-- Badge de atual -->
                  <div v-if="route.params.id === variation.id"
                    class="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <i class="fa-solid fa-check text-xs"></i>
                  </div>
                  <!-- Imagem pequena -->
                  <div class="relative w-16 h-16 mx-auto mb-2 rounded overflow-hidden bg-gray-100">
                    <img :src="variation.imageUrl || 'https://via.placeholder.com/100x100?text=Sem+Imagem'" 
                      :alt="variation.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div v-if="variation.stock === 0" 
                      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span class="text-white text-xs font-bold">Esgotado</span>
                    </div>
                  </div>
                  <!-- Nome -->
                  <p class="text-xs font-semibold text-gray-900 text-center mb-1 line-clamp-2">
                    {{ variation.name }}
                  </p>
                  <!-- Preço -->
                  <p class="text-sm font-bold text-blue-600 text-center">
                    R$ {{ variation.price ? variation.price.toFixed(2) : '0.00' }}
                  </p>
                  <!-- Estoque pequeno -->
                  <div class="flex justify-center mt-1">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                      :class="variation.stock === 0 ? 'bg-red-100 text-red-700' : 
                             variation.stock < 5 ? 'bg-yellow-100 text-yellow-700' : 
                             'bg-green-100 text-green-700'">
                      {{ variation.stock !== undefined ? variation.stock : 'N/A' }}
                    </span>
                  </div>
                </router-link>
              </div>
              <p class="text-xs text-gray-600 mt-2 text-center">
                <i class="fa-solid fa-info-circle mr-1"></i>
                {{ parentProduct ? 'Clique no produto principal ou em uma variação para ver os detalhes' : 'Clique em uma variação para ver os detalhes' }}
              </p>
            </div>

            <!-- Botão para adicionar ao carrinho -->
            <div class="mt-6">
              <!-- Se tem variações, abre modal -->
              <button v-if="variations && variations.length > 0" 
                @click="showVariationModal = true" 
                :disabled="isOutOfStock || isLoadingAdd"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
                aria-label="Selecionar variação para adicionar ao carrinho">
                <span class="flex items-center">
                  <i class="fa-solid fa-cart-plus mr-3"></i>
                  {{ isOutOfStock ? 'Produto Esgotado' : 'Escolher Variação' }}
                </span>
              </button>
              
              <!-- Se não tem variações, adiciona direto -->
              <button v-else 
                @click.prevent="handleAddToCart" 
                :disabled="isOutOfStock || isLoadingAdd"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
                aria-label="Adicionar ao carrinho">
                <span v-if="isLoadingAdd" class="flex items-center">
                  <i class="fa-solid fa-spinner fa-spin mr-3"></i>
                  Adicionando...
                </span>
                <span v-else class="flex items-center">
                  <i class="fa-solid fa-cart-plus mr-3"></i>
                  {{ isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Seleção de Variações -->
    <div v-if="showVariationModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="showVariationModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter">
        <!-- Header do Modal -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold flex items-center">
              <i class="fa-solid fa-layer-group mr-3"></i>
              Escolha uma Variação
            </h2>
            <p class="text-blue-100 mt-1">Selecione a variação que deseja adicionar ao carrinho</p>
          </div>
          <button @click="showVariationModal = false"
            class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <!-- Conteúdo do Modal -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Produto Principal como opção -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <i class="fa-solid fa-star text-yellow-500 mr-2"></i>
              Produto Principal
            </h3>
            <div @click="selectedVariationForModal = null"
              class="cursor-pointer border-2 rounded-xl p-4 transition-all duration-300"
              :class="selectedVariationForModal === null 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'">
              <div class="flex items-center gap-4">
                <div class="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img :src="product?.imageUrl || 'https://via.placeholder.com/200x200?text=Sem+Imagem'" 
                    :alt="product?.name"
                    class="w-full h-full object-cover" />
                  <div v-if="selectedVariationForModal === null"
                    class="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <i class="fa-solid fa-check text-xs"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-gray-900 mb-1">{{ product?.name }}</h4>
                  <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ product?.description || 'Sem descrição' }}</p>
                  <div class="flex items-center gap-4">
                    <span class="text-2xl font-bold text-blue-600">
                      R$ {{ product?.price ? product.price.toFixed(2) : '0.00' }}
                    </span>
                    <span class="text-xs px-3 py-1 rounded-full font-medium"
                      :class="availableStock === 0 ? 'bg-red-100 text-red-700' : 
                             availableStock < 5 ? 'bg-yellow-100 text-yellow-700' : 
                             'bg-green-100 text-green-700'">
                      <i class="fa-solid fa-box mr-1"></i>
                      Estoque: {{ availableStock }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Variações -->
          <div v-if="variations && variations.length > 0">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <i class="fa-solid fa-layer-group text-blue-500 mr-2"></i>
              Variações Disponíveis ({{ variations.length }})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="variation in variations" :key="variation.id"
                @click="selectedVariationForModal = variation"
                class="cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
                :class="selectedVariationForModal?.id === variation.id 
                  ? 'border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-300' 
                  : 'border-gray-200 bg-white hover:border-blue-300'">
                <div class="flex items-start gap-4">
                  <div class="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img :src="variation.imageUrl || 'https://via.placeholder.com/200x200?text=Sem+Imagem'" 
                      :alt="variation.name"
                      class="w-full h-full object-cover" />
                    <div v-if="variation.stock === 0" 
                      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span class="text-white text-xs font-bold">Esgotado</span>
                    </div>
                    <div v-if="selectedVariationForModal?.id === variation.id"
                      class="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <i class="fa-solid fa-check text-xs"></i>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-bold text-gray-900 mb-1 line-clamp-2">{{ variation.name }}</h4>
                    <p class="text-gray-600 text-sm mb-2 line-clamp-1">{{ variation.description || 'Sem descrição' }}</p>
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xl font-bold text-blue-600">
                        R$ {{ variation.price ? variation.price.toFixed(2) : '0.00' }}
                      </span>
                      <span class="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap"
                        :class="variation.stock === 0 ? 'bg-red-100 text-red-700' : 
                               variation.stock < 5 ? 'bg-yellow-100 text-yellow-700' : 
                               'bg-green-100 text-green-700'">
                        <i class="fa-solid fa-box mr-1"></i>
                        {{ variation.stock !== undefined ? variation.stock : 'N/A' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
      </div>
    </div>
  </div>

        <!-- Footer do Modal -->
        <div class="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between gap-4">
          <div>
            <p class="text-sm text-gray-600">
              <span class="font-semibold text-gray-900">Selecionado:</span>
              {{ selectedVariationForModal ? selectedVariationForModal.name : product?.name }}
            </p>
            <p class="text-lg font-bold text-blue-600 mt-1">
              R$ {{ selectedVariationForModal 
                ? (selectedVariationForModal.price ? selectedVariationForModal.price.toFixed(2) : '0.00')
                : (product?.price ? product.price.toFixed(2) : '0.00') }}
            </p>
          </div>
          <div class="flex gap-3">
            <button @click="showVariationModal = false"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
              Cancelar
            </button>
            <button @click.prevent="handleAddVariationToCart"
              :disabled="isLoadingAdd"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <i v-if="isLoadingAdd" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-cart-plus"></i>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useAlerts } from '../composables/useAlerts'
import { useCart } from '../composables/useCart'
import { getProductById, getProductVariations } from '../Services/ProductsService'

const route = useRoute()
const product = ref(null)
const parentProduct = ref(null)
const variations = ref([])
const isLoading = ref(true)
const isLoadingVariations = ref(false)
const error = ref(null)
const quantity = ref(1)
const isLoadingAdd = ref(false)
const showVariationModal = ref(false)
const selectedVariationForModal = ref(null)

const { showError: showErrorAlert, showSuccess } = useAlerts()

// Acessa a função de adicionar ao carrinho e items do carrinho
const { addToCart, items: cartItems } = useCart()

// Computed para verificar se está sem estoque
const isOutOfStock = computed(() => {
  if (!product.value || product.value.stock === undefined) return false
  return product.value.stock === 0
})

// Computed para estoque disponível (considerando itens no carrinho)
const availableStock = computed(() => {
  if (!product.value || product.value.stock === undefined) return 0
  const inCart = cartItems.value.find(item => item.id === product.value?.id)
  const cartQuantity = inCart ? inCart.quantity : 0
  return Math.max(0, product.value.stock - cartQuantity)
})

// Computed para classe do estoque
const getStockClass = (stock) => {
  if (stock === 0) return 'bg-red-100 text-red-700'
  if (stock < 5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

// Função para aumentar quantidade
function increaseQuantity() {
  if (quantity.value < availableStock.value) {
    quantity.value++
  }
}

// Função para diminuir quantidade
function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Handler para erro de imagem
function handleImageError(event) {
  event.target.src = 'https://via.placeholder.com/600x600?text=Sem+Imagem'
}

// Flag para evitar múltiplas chamadas simultâneas
let isLoadingData = false
let currentProductId = null
let loadPromise = null

// Função para carregar produto e variações
async function loadProductData() {
  const productId = route.params.id
  
  // Se já está carregando o mesmo produto, retorna a promise existente
  if (isLoadingData && currentProductId === productId && loadPromise) {
    if (import.meta.env.DEV) {

    }
    return loadPromise
  }
  
  // Se está carregando um produto diferente, espera terminar
  if (isLoadingData && currentProductId !== productId) {
    if (import.meta.env.DEV) {

    }
    if (loadPromise) {
      await loadPromise
    }
  }
  
  // Evita múltiplas chamadas simultâneas para o mesmo produto
  if (isLoadingData && currentProductId === productId) {
    if (import.meta.env.DEV) {

    }
    return
  }

  // Cria uma nova promise para o carregamento
  loadPromise = (async () => {
    isLoadingData = true
    currentProductId = productId
    isLoading.value = true
    error.value = null
    variations.value = []
    parentProduct.value = null
    
    try {
      if (!productId) {
        error.value = 'ID do produto não fornecido.'
        isLoading.value = false
        isLoadingData = false
        currentProductId = null
        return
      }

      if (import.meta.env.DEV) {

      }

      // Carrega o produto
      product.value = await getProductById(productId)
      
      if (import.meta.env.DEV) {

      }
      
      if (!product.value) {
        error.value = 'O produto solicitado não foi encontrado.'
        isLoading.value = false
        isLoadingData = false
        currentProductId = null
        return
      }
    
    // Verifica se este produto é uma variação (tem idPai)
    const idPai = product.value.idPai || product.value.IdPai || product.value.id_pai
    
    // Se for variação, busca o produto pai
    if (idPai) {
      try {
        parentProduct.value = await getProductById(idPai)
        if (import.meta.env.DEV) {

        }
      } catch (parentError) {
        if (import.meta.env.DEV) {
          console.error('Erro ao carregar produto pai:', parentError)
        }
      }
    }
    
    // Determina o produto pai (pode ser o próprio produto ou o idPai se for variação)
    const parentId = idPai || product.value.id
    
    // Busca variações do produto pai (pode ser do próprio produto ou do pai)
    isLoadingVariations.value = true
    try {
      const loadedVariations = await getProductVariations(parentId)
      
      // Se o produto atual é uma variação, filtra ele mesmo da lista
      if (idPai) {
        variations.value = loadedVariations.filter(v => v.id !== product.value.id)
      } else {
        variations.value = loadedVariations
      }
      
      if (import.meta.env.DEV) {

      }
    } catch (variationError) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar variações:', variationError)
      }
      variations.value = []
    } finally {
      isLoadingVariations.value = false
    }
    } catch (err) {
      error.value = 'Não foi possível carregar o produto. Tente novamente mais tarde.'
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar produto:', err)
      }
    } finally {
      isLoading.value = false
      isLoadingData = false
      currentProductId = null
      loadPromise = null
    }
  })()
  
  return loadPromise
}

// Carrega os dados quando o componente é montado
onMounted(() => {
  // Timeout de segurança para garantir que o loading não fique infinito
  const timeoutId = setTimeout(() => {
    if (isLoading.value && currentProductId === route.params.id) {
      console.error('Timeout ao carregar produto - desativando loading')
      isLoading.value = false
      isLoadingData = false
      currentProductId = null
      loadPromise = null
      error.value = 'Timeout ao carregar produto. Tente novamente.'
    }
  }, 15000) // 15 segundos

  loadProductData().finally(() => {
    clearTimeout(timeoutId)
  }).catch(() => {
    clearTimeout(timeoutId)
  })
})

// Hook do Vue Router: recarrega quando a rota é atualizada (mesmo componente, rota diferente)
let lastProductId = route.params.id
onBeforeRouteUpdate(async (to, from) => {
  // Se o ID do produto mudou, recarrega
  if (to.params.id !== from.params.id && to.params.id !== lastProductId) {
    lastProductId = to.params.id
    
    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      if (isLoading.value && currentProductId === to.params.id) {
        console.error('Timeout ao carregar produto - desativando loading')
        isLoading.value = false
        isLoadingData = false
        currentProductId = null
        loadPromise = null
        error.value = 'Timeout ao carregar produto. Tente novamente.'
      }
    }, 15000)
    
    try {
      await loadProductData()
    } finally {
      clearTimeout(timeoutId)
    }
  }
})

/**
 * Handler para adicionar produto ao carrinho (quando não há variações)
 * Usa a store do carrinho via composable
 */
async function handleAddToCart() {
  if (!product.value || isOutOfStock.value || isLoadingAdd.value) return

  isLoadingAdd.value = true
  try {
    // Adiciona a quantidade especificada
    for (let i = 0; i < quantity.value; i++) {
    addToCart(product.value)
  }

    await showSuccess(
      'Produto Adicionado!',
      `${quantity.value} ${quantity.value === 1 ? 'unidade' : 'unidades'} de "${product.value.name}" ${quantity.value === 1 ? 'foi' : 'foram'} adicionada${quantity.value > 1 ? 's' : ''} ao carrinho.`
    )

    // Reset quantidade
    quantity.value = 1
  } catch (err) {
    await showErrorAlert('Erro', 'Não foi possível adicionar o produto ao carrinho.')
  } finally {
    isLoadingAdd.value = false
  }
}

/**
 * Handler para adicionar variação selecionada ao carrinho
 */
async function handleAddVariationToCart() {
  if (isLoadingAdd.value) return
  
  const productToAdd = selectedVariationForModal.value || product.value
  
  if (!productToAdd) return
  
  // Verifica estoque
  const stockToCheck = selectedVariationForModal.value 
    ? (selectedVariationForModal.value.stock !== undefined ? selectedVariationForModal.value.stock : 0)
    : availableStock.value
    
  if (stockToCheck === 0 || stockToCheck === undefined) {
    await showErrorAlert('Produto Esgotado', 'Esta variação está esgotada.')
    return
  }

  isLoadingAdd.value = true
  try {
    // Adiciona a quantidade especificada
    for (let i = 0; i < quantity.value; i++) {
      addToCart(productToAdd)
    }

    const productName = selectedVariationForModal.value 
      ? selectedVariationForModal.value.name 
      : product.value.name

    await showSuccess(
      'Produto Adicionado!',
      `${quantity.value} ${quantity.value === 1 ? 'unidade' : 'unidades'} de "${productName}" ${quantity.value === 1 ? 'foi' : 'foram'} adicionada${quantity.value > 1 ? 's' : ''} ao carrinho.`
    )

    // Fecha modal e reseta
    showVariationModal.value = false
    selectedVariationForModal.value = null
    quantity.value = 1
  } catch (err) {
    await showErrorAlert('Erro', 'Não foi possível adicionar o produto ao carrinho.')
  } finally {
    isLoadingAdd.value = false
  }
}

// Quando abre o modal, seleciona o produto atual por padrão
watch(showVariationModal, (isOpen) => {
  if (isOpen) {
    // Por padrão, seleciona o produto atual (não uma variação)
    selectedVariationForModal.value = null
  }
})
</script>

<style scoped>
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-enter {
  animation: modal-enter 0.3s ease-out;
}
</style>