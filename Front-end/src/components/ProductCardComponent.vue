<template>
  <div class="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
    <img 
      :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'" 
      :alt="product.name" 
      class="w-full h-48 object-cover mb-4 rounded"
    />
    <h2 class="text-lg font-semibold">{{ product.name }}</h2>
    <p class="text-gray-600 mt-2">{{ product.description }}</p>
    <p class="text-blue-600 font-bold mt-4">R$ {{ product.price.toFixed(2) }}</p>
    <button 
      @click="addToCart" 
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      Adicionar ao Carrinho
    </button>
  </div>
</template>

<script setup>
const props = defineProps(['product'])
const emit = defineEmits(['add'])

function addToCart() {
  emit('add', props.product)
}
</script>
