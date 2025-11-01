<template>
  <!-- Página de detalhes do produto -->
  <div v-if="product" class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8">
          <!-- Imagem do produto -->
          <div class="lg:col-span-1 p-6">
            <img :src="product.imageUrl || 'https://via.placeholder.com/600x600?text=Sem+Imagem'" :alt="product.name"
              class="w-full h-96 object-cover rounded-lg">
          </div>

          <!-- Informações do produto -->
          <div class="lg:col-span-1 p-6 flex flex-col justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
              <p class="text-gray-600 mb-6 text-lg">{{ product.description }}</p>
              <p class="text-4xl font-bold text-blue-600 mb-6">
                R$ {{ product.price ? product.price.toFixed(2) : '0.00' }}
              </p>
            </div>

            <!-- Botão para adicionar ao carrinho -->
            <div>
              <button @click="handleAddToCart"
                class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
                aria-label="Adicionar ao carrinho">
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Link para voltar -->
      <div class="mt-6">
        <router-link to="/produtos" class="text-gray-600 hover:text-gray-900 underline">
          ← Voltar para produtos
        </router-link>
      </div>
    </div>
  </div>

  <!-- Estado de carregamento -->
  <div v-else class="text-center mt-24">
    <p class="text-gray-600">Carregando produto...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProductById } from '../Services/ProductsService'
import { useCart } from '../composables/useCart'

const route = useRoute()
const product = ref(null)

// Acessa a função de adicionar ao carrinho
const { addToCart } = useCart()

// Carrega os dados do produto ao montar o componente
onMounted(async () => {
  try {
    product.value = await getProductById(route.params.id)
  } catch (error) {
    // Erro já é tratado pelo service
    product.value = null
  }
})

/**
 * Handler para adicionar produto ao carrinho
 * Usa a store do carrinho via composable
 */
function handleAddToCart() {
  if (product.value) {
    addToCart(product.value)
  }
}
</script>