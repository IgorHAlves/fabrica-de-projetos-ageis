<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import { getProducts } from '../Services/ProductsService';
import { useProductsStore } from '@/stores/products';
import { useAlerts } from '../composables/useAlerts';

const route = useRoute();
const products = ref({ items: [], totalPages: 0 });
const pageNumber = ref(1);
const pageSize = 12;
const isLoading = ref(false);

const store = useProductsStore();
const { showSuccess, showError, showConfirm } = useAlerts();

// Busca do query parameter
const searchTerm = computed(() => route.query.search || '');

// Produtos filtrados baseado na busca e sem variações (produtos com idPai)
const filteredProducts = computed(() => {
  let items = products.value.items || []
  
  // Remove variações (produtos com idPai)
  items = items.filter(product => {
    const idPai = product.idPai || product.IdPai || product.id_pai
    return !idPai // Só mantém produtos que NÃO têm idPai
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
    totalItems: items.length // Atualiza contagem total
  };
});

/**
 * Carrega produtos da API com paginação e busca
 */
async function carregarProdutos() {
  isLoading.value = true
  try {
    // Passa o termo de busca para a API
    const data = await getProducts(pageNumber.value, pageSize, searchTerm.value);
    products.value = data;
  } catch (error) {
    // Em caso de erro, mostra mensagem apenas se não for erro de rede esperado
    if (error.response) {
      showError('Erro ao carregar produtos', 'Não foi possível carregar a lista de produtos.')
    }
    products.value = { items: [], totalPages: 0 };
  } finally {
    isLoading.value = false
  }
}

onMounted(carregarProdutos);

// Observa mudanças na rota (query parameters) e recarrega produtos se necessário
watch(() => route.query, () => {
  // Recarrega produtos quando a busca mudar
  if (route.name === 'produtos') {
    carregarProdutos();
  }
}, { deep: true });

/**
 * Atualiza a lista de produtos
 */
async function atualizarProdutos() {
  await carregarProdutos();
}

/**
 * Navega para a próxima página
 */
function proximo() {
  if (pageNumber.value < products.value.totalPages) {
    pageNumber.value++;
    atualizarProdutos();
  }
}

/**
 * Navega para a página anterior
 */
function anterior() {
  if (pageNumber.value > 1) {
    pageNumber.value--;
    atualizarProdutos();
  }
}

/**
 * Função mantida para compatibilidade com eventos @add
 * Nota: O ProductCardComponent agora adiciona diretamente ao carrinho,
 * então esta função não é mais necessária mas é mantida para evitar erros
 * @param {Object} product - Produto a ser adicionado
 */
function AdicionaraoCarrinho(product) {
  // Não faz nada - o componente já adiciona diretamente via useCart
  // Mantida apenas para não quebrar se algum componente ainda usar @add
}

/**
 * Deleta um produto após confirmação
 * @param {Object} product - Produto a ser deletado
 */
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
      // Atualiza a lista local sem precisar recarregar toda a página
      products.value.items = products.value.items.filter(p => p.id !== product.id);
      showSuccess('Produto deletado com sucesso!');
    } else {
      showError('Erro ao deletar produto.');
    }
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Lista de Produtos</h1>

    <!-- Mostra termo de busca se houver -->
    <div v-if="searchTerm" class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-gray-700">
        <i class="fa-solid fa-magnifying-glass mr-2 text-blue-500"></i>
        Buscando por: <span class="font-semibold text-blue-600">"{{ searchTerm }}"</span>
        <span class="text-sm text-gray-500 ml-2">({{ filteredProducts.items?.length || 0 }} resultado(s))</span>
      </p>
    </div>

    <div class="container mx-auto bg-blue-100 p-8 rounded-lg shadow">
      <!-- Estado de carregamento -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p class="text-gray-600">Carregando produtos...</p>
      </div>

      <!-- Lista de produtos -->
      <div v-else-if="filteredProducts.items && filteredProducts.items.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="product in filteredProducts.items" :key="product.id" class="relative group">
          <ProductCardComponent :product="product" @add="AdicionaraoCarrinho" />

          <!-- Botão de deletar -->
          <button @click="deletarProduto(product)"
            class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            title="Deletar produto" aria-label="Deletar produto">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Estado vazio: quando não há produtos (e não está carregando) -->
      <div v-else-if="!isLoading" class="text-center py-12">
        <i class="fa-solid fa-box-open mx-auto text-6xl text-gray-400 mb-4"></i>
        <p class="text-gray-500 text-lg font-semibold">
          {{ searchTerm ? 'Nenhum produto encontrado para "' + searchTerm + '"' : 'Nenhum produto encontrado' }}
        </p>
        <p class="text-gray-400 text-sm mt-2">
          <template v-if="searchTerm">
            Tente buscar com outro termo ou limpe a busca.
          </template>
          <template v-else>
            Verifique se o backend está rodando ou tente novamente mais tarde.
          </template>
        </p>
        <button v-if="searchTerm" @click="$router.push('/produtos')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Limpar busca
        </button>
      </div>

      <!-- Paginação -->
      <div v-if="filteredProducts.items && filteredProducts.items.length > 0 && products.totalPages > 1 && !searchTerm"
        class="flex justify-center items-center gap-4 mt-8">
        <!-- Botão Anterior -->
        <button @click="anterior" :disabled="pageNumber === 1" title="Página anterior" aria-label="Página anterior"
          class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0z" />
          </svg>
          Anterior
        </button>

        <!-- Indicador de página -->
        <span class="text-gray-600 font-semibold">
          Página {{ pageNumber }} de {{ products.totalPages }}
        </span>

        <!-- Botão Próximo -->
        <button @click="proximo" :disabled="pageNumber === products.totalPages" title="Próxima página"
          aria-label="Próxima página"
          class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm">
          Próximo
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
