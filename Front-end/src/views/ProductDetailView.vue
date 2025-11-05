<template>
  <!-- Product Info -->

  <div v-if="product"
    class="relative group-hover:block sm:px-1 sm:grid sm:grid-cols-3 sm:grid-rows-[auto_auto_1fr] lg:gap-x-1 lg:px-4 lg:pt- lg:pb-4 border rounded-lg p-4 shadow hover:shadow-lg transition ml-48 mr-48 mt-24 bg-white hover:-translate-y-2 mt-12 hover:scale-105 hover:shadow-2xl flex flex-col justify-center items-center my-24 ">

    <div
      class="sm:col-span-2 lg:border-r lg:border-gray-200 lg:pr-1 justify-center items-center flex flex-col border-b border-t border-l border-2 border-blue-300">
      <img :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'" :alt="product.name"
        class="w-96 h-[32rem] mt-12 object-cover">
      <div class="relative flex gap-4 ">
        <img src="https://copilot.microsoft.com/th/id/BCO.545b80a4-99da-4189-9e2c-47c7ae96d3a9.png" :alt="product.name"
          class="w-24 h-24 object-cover rounded-lg mt-12 border my-6 border-2 border-black shadow hover:shadow-lg transition bg-gray-300 p-1 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl" />

        <img src="https://copilot.microsoft.com/th/id/BCO.c38016e9-043c-4d04-ae8d-14923d8b2c70.png" :alt="product.name"
          class="w-24 h-24 object-cover rounded-lg mt-12 border my-6 border-2 border-black	shadow hover:shadow-lg transition bg-gray-300 p-1 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl" />
      </div>

    </div>

    <!--Info do Produto-->
    <div class="sm:mt-0 sm:col-span-1 lg:pl-8 flex flex-col justify-center gap-8 mt-12 mb-12">
      <router-link to="/produtos"
        class="flex items-center text-red-600 font-bold hover:underline absolute top-4 right-4 ">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </router-link>

      <h2 class="text-lg font-semibold text-lg flex mt-8">{{ product.name }}</h2>
      <p class="text-blue-600 font-bold m-1 text-lg">R$ {{ product.price }}</p>
      <p class="text-gray-600">{{ product.description }}</p>

      <!-- <div class="relative flex gap-2 ">
        <h4 id="stock" class="font-bold">Estoque:</h4>
        <p class="text-gray-600 font-bold">{{ product.stock }}</p>
      </div> -->

      <!--Quantidade-->
      <div class="">
        <h4 class="text-sm font-bold">Quantidade</h4>
        <button @click="decrementar" :disabled="quantidade <= 1" class="font-bold">-</button>

        <input type="number" v-model="quantidade" :min="1" :max="product.stock"
          class="w-10 m-2 text-center text-sm font-bold border border-gray-300 rounded " />

        <button @click="incrementar" :disabled="quantidade >= product.stock" class="font-bold">+</button>
      </div>

      <!--Botão carrinho-->
      <div class="flex justify-center items-center mr-12">
        <button class="bg-blue-600 border p-4 rounded-lg text-white mt-12 w-96 hover:bg-blue-800 transition">
          Adicionar ao Carrinho
        </button>
      </div>

    </div>
  </div>

  <div v-else class="text-center mt-24">
    <p>Carregando produto...</p>
  </div>
</template>










<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProductById } from '../Services/ProductsService'
import { useCounter } from '../composables/useCounter'

const route = useRoute()
const product = ref(null)
let quantidade, incrementar, decrementar

onMounted(async () => {
  try {
    product.value = await getProductById(route.params.id)
    const counter = useCounter(product.value.stock, 1)
    quantidade = counter.quantidade
    incrementar = counter.incrementar
    decrementar = counter.decrementar

  } catch (error) {
    console.error('Erro ao carregar produto:', error)
  }
})
</script>