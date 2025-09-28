<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCardComponent from '@/components/ProductCardComponent.vue'

// lista reativa para armazenar produtos
const products = ref([])

// busca os produtos ao montar o componente
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5229/api/Product?skip=0&take=10')
    products.value = response.data
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Detalhes do Produto</h1>

    <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <ProductCardComponent
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add="console.log('Adicionar ao carrinho:', product)"
      />
    </div>

    <p v-else class="text-gray-500">Carregando produtos...</p>
  </div>
</template>
