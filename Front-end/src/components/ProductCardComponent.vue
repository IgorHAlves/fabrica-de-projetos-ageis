<template>
    <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <img :src="null" :alt="null" class="w-full h-48 object-cover mb-4 rounded" />
        <h2 class="text-lg font-semibold"></h2>
        <p class="text-gray-600 mt-2"></p>
        <p class="text-blue-600 font-bold mt-4">R$ </p>
        <button @click="addToCart" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Adicionar ao Carrinho</button>
    </div>
</template>

<script setup>
defineProps(['product'])
const emit = defineEmits(['add'])

function addToCart() {
  emit('add', product)
}
</script>

