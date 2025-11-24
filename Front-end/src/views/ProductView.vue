<script setup>
import { useProductsStore } from '@/stores/products';
import { computed, onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import { useAlerts } from '../composables/useAlerts';
import { getProducts } from '../Services/ProductsService';

const route = useRoute();
const products = ref({ items: [], totalPages: 0 });
const pageNumber = ref(1);
const pageSize = 12;
const isLoading = ref(false);

const store = useProductsStore();
const { showSuccess, showError, showConfirm } = useAlerts();

// Busca do query parameter
const searchTerm = computed(() => route.query.search || '');

// Produtos filtrados baseado na busca, sem variações e sem produtos sem estoque
const filteredProducts = computed(() => {
  let items = products.value.items || []
  
  // Remove variações (produtos com idPai)
  items = items.filter(product => {
    const idPai = product.idPai || product.IdPai || product.id_pai
    return !idPai // Só mantém produtos que NÃO têm idPai
  })
  
  // Remove produtos sem estoque (stock === 0 ou undefined)
  items = items.filter(product => {
    const stock = product.stock
    return stock !== undefined && stock !== null && stock > 0
  })
  
  // Aplica filtro de busca se houver
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    items = items.filter(product =>
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    )
  }

  return {
    ...products.value,
    items: items,
    totalItems: items.length
  };
});

// Flag para evitar múltiplas chamadas simultâneas
let isLoadingProducts = false

async function carregarProdutos() {
  if (isLoadingProducts) return

  isLoadingProducts = true
  isLoading.value = true
  
  try {
    const data = await getProducts(pageNumber.value, pageSize, searchTerm.value);
    products.value = data;
  } catch (error) {
    if (error.response) {
      showError('Erro ao carregar produtos', 'Não foi possível carregar a lista de produtos.')
    }
    products.value = { items: [], totalPages: 0 };
  } finally {
    isLoading.value = false
    isLoadingProducts = false
  }
}

onMounted(() => {
  carregarProdutos();
  window.addEventListener('cart-checkout-completed', carregarProdutos);
});

let lastRoutePath = route.path
let lastRouteQuery = JSON.stringify(route.query)
onBeforeRouteUpdate((to, from) => {
  const toPath = to.path
  const toQuery = JSON.stringify(to.query || {})
  
  if (to.name === 'produtos' && 
      (toPath !== lastRoutePath || toQuery !== lastRouteQuery) &&
      !isLoadingProducts) {
    lastRoutePath = toPath
    lastRouteQuery = toQuery
    carregarProdutos();
  }
});

async function atualizarProdutos() {
  await carregarProdutos();
}

function proximo() {
  if (pageNumber.value < products.value.totalPages) {
    pageNumber.value++;
    atualizarProdutos();
  }
}

function anterior() {
  if (pageNumber.value > 1) {
    pageNumber.value--;
    atualizarProdutos();
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
    const success = await store.deleteProduct(product.id);
    if (success) {
      products.value.items = products.value.items.filter(p => p.id !== product.id);
      showSuccess('Produto deletado com sucesso!');
    } else {
      showError('Erro ao deletar produto.');
    }
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
    <div v-if="searchTerm" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <p class="text-gray-700">
            <i class="fa-solid fa-magnifying-glass mr-2 text-blue-500"></i>
            Buscando por: <span class="font-semibold text-blue-600">"{{ searchTerm }}"</span>
            <span class="text-sm text-gray-500 ml-2">({{ filteredProducts.items?.length || 0 }} resultado(s))</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p class="text-gray-600">Carregando produtos...</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="filteredProducts.items && filteredProducts.items.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in filteredProducts.items" :key="product.id" class="relative group">
            <ProductCardComponent :product="product" />

            <!-- Delete Button (Admin Only) -->
            <button @click="deletarProduto(product)"
              class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              title="Deletar produto" aria-label="Deletar produto">
              <i class="fa-solid fa-trash text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fa-solid fa-box-open text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg mb-2">
            {{ searchTerm ? 'Nenhum produto encontrado para sua busca' : 'Nenhum produto disponível' }}
          </p>
          <p v-if="searchTerm" class="text-gray-500 text-sm">
            Tente buscar por outros termos ou navegue por todas as categorias
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredProducts.items && filteredProducts.items.length > 0 && products.totalPages > 1"
          class="flex justify-center items-center gap-4 mt-12">
          <button @click="anterior" :disabled="pageNumber === 1"
            class="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow">
            <i class="fa-solid fa-chevron-left mr-2"></i>
            Anterior
          </button>

          <span class="text-gray-700 font-medium">
            Página {{ pageNumber }} de {{ products.totalPages }}
          </span>

          <button @click="proximo" :disabled="pageNumber >= products.totalPages"
            class="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow">
            Próximo
            <i class="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
