<script setup>
import { ref, onMounted } from 'vue';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import { getProducts } from '../Services/ProductsService';
import { useProductsStore } from '@/stores/products';
import { useAlerts } from '../composables/useAlerts';


const products = ref([]);
<<<<<<< HEAD
const pageNumber = ref(1);
const pageSize = 12;
const totalPages = ref(0);

=======
const paginaAtual = ref(0);
const take = 10;
const store = useProductsStore();
const { showSuccess, showError, showConfirm } = useAlerts();
>>>>>>> development


onMounted(async () => {
  try {
<<<<<<< HEAD
    products.value = await getProducts(pageNumber.value, pageSize);
=======
    const skip = paginaAtual.value * take;
    products.value = await getProducts(skip, take);
    console.log(products.value);
>>>>>>> development
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
});

async function atualizarProdutos() {
<<<<<<< HEAD
  products.value = await getProducts(pageNumber.value, pageSize);
}

function proximo() {
  if (pageNumber.value < products.value.totalPages) {
    pageNumber.value++;
    atualizarProdutos();
  }
}
=======
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
>>>>>>> development

function anterior() {
  if (pageNumber.value > 1) {
    pageNumber.value--;
    atualizarProdutos();
  }
}



function AdicionaraoCarrinho(product) {
  console.log('Produto adicionado ao carrinho:'.product);
}
</script>


<template>
  <div class="max-w-7xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Lista de Produto</h1>

    <div class="container mx-auto bg-blue-100 p-20 rounded-lg shadow">

<<<<<<< HEAD

      <div v-if="products.items" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 limit-4">
        <ProductCardComponent v-for="product in products.items" :key="product.id" :product="product"
          @add="console.log('Adicionar ao carrinho:', product)" />
=======
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
>>>>>>> development
      </div>

      <p v-else class="text-gray-500">Carregando produtos...</p>

      <div class="flex justify-center gap-4 cursor-not-allowed md:cursor-auto">

<<<<<<< HEAD
        <button @click="anterior" title="Anterior"
=======
        <!-- Botão Anterior -->
        <button @click="anterior" :disabled="paginaAtual === 0" title="Anterior"
>>>>>>> development
          class="px-2 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition justify-center items-center flex mt-12">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
            <path
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clip-rule="evenodd" fill-rule="evenodd"></path>
          </svg>
          Anterior
        </button>

<<<<<<< HEAD
        <button @click="proximo" title="Proximo" :disabled="pageNumber.value === totalPages" class="px-2 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition justify-center items-center flex flex-row-reverse mt-auto
         cursor-not-allowed md:cursor-auto disabled:opacity-50 disabled:hover:bg-white">
=======
        <!-- Botão Proximo -->

        <button @click="proximo" title="Proximo"
          class="px-2 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition justify-center items-center flex flex-row-reverse mt-auto ">
>>>>>>> development
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
