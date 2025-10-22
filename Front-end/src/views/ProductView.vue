<script setup>
import { ref, onMounted } from 'vue';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import { getProducts } from '../Services/ProductsService';
import { useProductsStore } from '@/stores/products';
import { useAlerts } from '../composables/useAlerts';


const products = ref([]);
const paginaAtual = ref(0);
const take = 10;
const store = useProductsStore();
const { showSuccess, showError, showConfirm } = useAlerts();


onMounted(async () => {
  try {
    const skip = paginaAtual.value * take;
    products.value = await getProducts(skip, take);
    console.log(products.value);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
});

async function atualizarProdutos() {
  const skip = paginaAtual.value * take;
  products.value = await getProducts(skip, take);
}
function proximo() {
  paginaAtual.value++;
  atualizarProdutos();
}
function anterior() {
  if (paginaAtual.value > 0) {
    paginaAtual.value--;
    atualizarProdutos();
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
      // Atualizar a lista local removendo o produto deletado
      products.value = products.value.filter(p => p.id !== product.id);
    }
  }
}
</script>



<template>
  <div class="max-w-7xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Detalhes do Produto</h1>

    <div class="container mx-auto bg-blue-100 p-20 rounded-lg shadow">

      <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 limit-4">
        <div v-for="product in products" :key="product.id" class="relative group">
          <ProductCardComponent :product="product" @add="AdicionaraoCarrinho" />
          <!-- Botão de deletar (aparece no hover) -->
          <button @click="deletarProduto(product)"
            class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            title="Deletar produto">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p v-else class="text-gray-500">Carregando produtos...</p>

      <!-- Componente de paginação -->
      <div class="flex justify-center gap-4 ">

        <!-- Botão Anterior -->
        <button @click="anterior" :disabled="paginaAtual === 0" title="Anterior"
          class="px-2 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition justify-center items-center flex mt-12">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
            <path
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clip-rule="evenodd" fill-rule="evenodd"></path>
          </svg>
          Anterior
        </button>

        <!-- Botão Proximo -->

        <button @click="proximo" title="Proximo"
          class="px-2 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition justify-center items-center flex flex-row-reverse mt-auto ">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5 ">
            <path
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Próximo
        </button>
      </div>
    </div>
  </div>

</template>
