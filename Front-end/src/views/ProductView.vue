<script setup>
import {ref, onMounted} from 'vue';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import { getProducts } from '../Services/ProductsService';


const products = ref([]);
const paginaAtual = ref(0);
const take = 10;
const skip = paginaAtual.value * take;


onMounted(async () => {
  try{
    products.value = await getProducts(skip, take);
    console.log(products.value);
  } catch (error){
    console.error('Erro ao carregar produtos:', error)
  }
});

async function atualizarProdutos(){
  const skip = paginaAtual.value * take;
  products.value = await getProducts(skip, take);
}
function proximo(){
  paginaAtual.value++;
  atualizarProdutos();
}
function anterior(){
  if(paginaAtual.value > 0){
    paginaAtual.value--;
    atualizarProdutos();
  }
}
  function AdicionaraoCarrinho(product){
    console.log('Produto adicionado ao carrinho:'. product);
  }
</script>



<template>
  <div class="max-w-7xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Detalhes do Produto</h1>

    <div class="container mx-auto bg-blue-100 p-20 rounded-lg shadow">

      <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 limit-4">
        <ProductCardComponent
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add="console.log('Adicionar ao carrinho:', product)"
        />
      </div>
      <p v-else class="text-gray-500">Carregando produtos...</p>

      <!-- Componente de paginação -->
      <div class="flex justify-center gap-4 ">

        <!-- Botão Anterior -->
        <button @click="anterior":disabled="paginaAtual === 0"
        title="Anterior" class="px-2 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition justify-center items-center flex mt-12">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
            <path d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" fill-rule="evenodd"></path>
          </svg>
          Anterior
        </button>

        <!-- Botão Proximo -->
         
        <button @click="proximo" title="Proximo" class="px-2 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 transition justify-center items-center flex flex-row-reverse mt-auto ">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5 ">
            <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Próximo
        </button>
      </div>
    </div>
  </div>
  
</template>
