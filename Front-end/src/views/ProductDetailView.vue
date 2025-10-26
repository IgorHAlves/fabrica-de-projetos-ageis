<template>
  <!-- Product Info -->
   
  <div v-if="product" class="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24 border rounded-lg p-4 shadow hover:shadow-lg transition ml-24 mr-24 mt-24 bg-white hover:-translate-y-2 hover:scale-105 hover:shadow-2xl flex flex-col justify-center items-center">
    <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
      <img :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'" :alt="product.name">
      <h2 class="text-lg font-semibold">{{ product.name }}</h2>
    </div>
    
    <div class="mt-4 lg:row-span-3 lg:mt-0">
      <p class="text-gray-600 mt-2">{{ product.description }}</p>
      <p class="text-blue-600 font-bold mt-4">R$ {{ product.price }}</p>
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

const route = useRoute()
const product = ref([])

onMounted(async () => {
  try {
    product.value = await getProductById(route.params.id)
  } catch (error) {
    console.error('Erro ao carregar produto:', error)
  }
})
</script>