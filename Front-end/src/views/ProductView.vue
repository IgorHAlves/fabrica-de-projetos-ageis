<script setup>
import { useProductsStore } from '@/stores/products';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import ProductSkeleton from '../components/ProductSkeleton.vue';
import { useAlerts } from '../composables/useAlerts';

const route = useRoute();
const store = useProductsStore();
const { showSuccess, showError, showConfirm } = useAlerts();

// Computed properties da store
const products = computed(() => store.products);
const isLoading = computed(() => store.isLoading);
const pageNumber = computed(() => store.pageNumber);
const totalPages = computed(() => store.totalPages);
const searchName = computed(() => store.searchName);

// Produtos filtrados (apenas para remover variações e sem estoque, se necessário)
// A busca por nome já é feita na API via store
const filteredProducts = computed(() => {
  let items = products.value || []
  
  // Remove variações (produtos com idPai) - se a API já não filtrar
  items = items.filter(product => {
    const idPai = product.idPai || product.IdPai || product.id_pai
    return !idPai 
  })
  
  return items;
});

// Carregar produtos ao montar
onMounted(() => {
  // Se houver query param na URL, atualiza a store
  if (route.query.search) {
    store.setSearchName(route.query.search);
  }
  
  store.fetchProducts();
});

// Observa mudanças na rota (query params)
watch(() => route.query.search, (newSearch) => {
  if (newSearch !== undefined) {
    store.setSearchName(newSearch || '');
    store.setPage(1);
    store.fetchProducts();
  }
});

function proximo() {
  if (pageNumber.value < totalPages.value) {
    store.setPage(pageNumber.value + 1);
    store.fetchProducts();
  }
}

function anterior() {
  if (pageNumber.value > 1) {
    store.setPage(pageNumber.value - 1);
    store.fetchProducts();
  }
}

async function deletarProduto(product) {
  const result = await showConfirm(
    'Deletar Produto',
    `Tem certeza que deseja deletar "${product.name}"? Esta ação não pode ser desfeita.`,
    'Sim, deletar',
    'Cancelar'
  );

  if (result.isConfirmed) {
    await store.deleteProduct(product.id);
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-extrabold mb-4">
          <i class="fa-solid fa-store mr-3"></i>
          Nossos Produtos
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">
          Explore nossa coleção completa de produtos incríveis
        </p>
      </div>
    </section>

    <!-- Search Result Banner -->
    <div v-if="searchName" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <p class="text-gray-700">
            <i class="fa-solid fa-magnifying-glass mr-2 text-blue-500"></i>
            Buscando por: <span class="font-semibold text-blue-600">"{{ searchName }}"</span>
            <span class="text-sm text-gray-500 ml-2">({{ filteredProducts.length || 0 }} resultado(s))</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductSkeleton v-for="i in 8" :key="i" />
        </div>

        <!-- Products Grid -->
        <div v-else-if="filteredProducts && filteredProducts.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in filteredProducts" :key="product.id" class="relative group">
            <ProductCardComponent :product="product" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fa-solid fa-box-open text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg mb-2">
            {{ searchName ? 'Nenhum produto encontrado para sua busca' : 'Nenhum produto disponível' }}
          </p>
          <p v-if="searchName" class="text-gray-500 text-sm">
            Tente buscar por outros termos ou navegue por todas as categorias
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredProducts && filteredProducts.length > 0 && totalPages > 1"
          class="flex justify-center items-center gap-4 mt-12">
          <button @click="anterior" :disabled="pageNumber === 1"
            class="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow">
            <i class="fa-solid fa-chevron-left mr-2"></i>
            Anterior
          </button>

          <span class="text-gray-700 font-medium">
            Página {{ pageNumber }} de {{ totalPages }}
          </span>

          <button @click="proximo" :disabled="pageNumber >= totalPages"
            class="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow">
            Próximo
            <i class="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
