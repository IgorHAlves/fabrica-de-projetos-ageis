<template>
  <div class="max-w-7xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Lista de Produtos</h1>

    <div class="container mx-auto bg-blue-100 p-8 rounded-lg shadow">
      <div
        v-if="store.items && store.items.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
      >
        <div v-for="product in store.items" :key="product.id" class="relative group">
          <ProductCardComponent :product="product" @add="AdicionaraoCarrinho" />

          <!-- Botão de deletar -->
          <button
            @click="deletarProduto(product)"
            class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            title="Deletar produto"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <p v-else class="text-gray-500 text-center">Carregando produtos...</p>

      <!-- Paginação -->
      <div class="flex justify-center gap-4 mt-8">
        <button
          @click="anterior"
          :disabled="store.pageNumber === 1"
          title="Anterior"
          class="px-4 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition disabled:opacity-50"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="inline w-5 h-5 mr-1">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0z"
            />
          </svg>
          Anterior
        </button>

        <button
          @click="proximo"
          :disabled="store.pageNumber === store.totalPages"
          title="Próximo"
          class="px-4 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition disabled:opacity-50"
        >
          Próximo
          <svg viewBox="0 0 20 20" fill="currentColor" class="inline w-5 h-5 ml-1">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>







<script setup>
import {onMounted } from 'vue';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import { useProductsStore } from '@/stores/products';
import { useAlerts } from '../composables/useAlerts';

const store = useProductsStore();
const { showSuccess, showError, showConfirm } = useAlerts();

onMounted(store.fetchProducts);

function proximo() {
  if (store.pageNumber < store.totalPages) {
    store.pageNumber++;
    store.fetchProducts();
  }
}

function anterior() {
  if (store.pageNumber > 1) {
    store.pageNumber--;
    store.fetchProducts();
  }
}

function AdicionaraoCarrinho(product) {
  console.log('Produto adicionado ao carrinho:', product);
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
      // Atualiza a lista local sem precisar recarregar toda a página
      products.value.items = products.value.items.filter(p => p.id !== product.id);
      showSuccess('Produto deletado com sucesso!');
    } else {
      showError('Erro ao deletar produto.');
    }
  }
}
</script>