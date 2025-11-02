<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Bem-vindo à Nossa Loja
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Descubra produtos incríveis com os melhores preços do mercado
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/produtos"
              class="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <i class="fa-solid fa-store mr-2"></i>
              Explorar Produtos
            </router-link>
            <router-link to="/carrinho"
              class="bg-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 border-2 border-white shadow-lg">
              <i class="fa-solid fa-cart-shopping mr-2"></i>
              Ver Carrinho
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Produtos em Destaque -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
          <p class="text-gray-600 text-lg">Confira nossos produtos mais populares</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p class="text-gray-600">Carregando produtos...</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="featuredProducts.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCardComponent v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fa-solid fa-box-open text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg">Nenhum produto encontrado</p>
          <router-link to="/admin/produtos/novo"
            class="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Cadastrar Primeiro Produto
          </router-link>
        </div>

        <!-- Ver Todos os Produtos -->
        <div v-if="featuredProducts.length > 0" class="text-center mt-12">
          <router-link to="/produtos"
            class="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Ver Todos os Produtos
            <i class="fa-solid fa-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div
            class="bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-truck-fast text-3xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Entrega Rápida</h3>
            <p class="text-gray-600">Receba seus produtos com segurança e agilidade</p>
          </div>

          <!-- Feature 2 -->
          <div
            class="bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-shield-halved text-3xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Compra Segura</h3>
            <p class="text-gray-600">Seus dados protegidos com criptografia avançada</p>
          </div>

          <!-- Feature 3 -->
          <div
            class="bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-headset text-3xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Suporte 24/7</h3>
            <p class="text-gray-600">Nossa equipe está sempre pronta para ajudar</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-4">Comece a Comprar Agora</h2>
        <p class="text-xl text-indigo-100 mb-8">
          Cadastre produtos e comece a vender hoje mesmo
        </p>
        <router-link to="/admin/produtos/novo"
          class="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <i class="fa-solid fa-plus-circle mr-2"></i>
          Cadastrar Produto
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCardComponent from '../components/ProductCardComponent.vue'
import { getProducts } from '../Services/ProductsService'

const featuredProducts = ref([])
const isLoading = ref(false)

/**
 * Carrega produtos em destaque (primeiros 8 produtos)
 * Filtra variações (produtos com idPai) para não mostrar na home
 */
async function loadFeaturedProducts() {
  isLoading.value = true
  try {
    const data = await getProducts(1, 8, '')
    let items = data.items || []
    
    // Remove variações (produtos com idPai) - só mostra produtos principais
    items = items.filter(product => {
      const idPai = product.idPai || product.IdPai || product.id_pai
      return !idPai // Só mantém produtos que NÃO têm idPai
    })
    
    featuredProducts.value = items
  } catch (error) {
    featuredProducts.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFeaturedProducts()
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
</style>
