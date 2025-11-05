<script setup>
import ProductCard from './ProductCardComponent.vue';


const props = defineProps({
  produtos: {
    type: Array,
    required: true
  }
});

// const emit = defineEmits(['add-to-cart']);

// function adicionarAoCarrinho(produto) {
//   emit('add-to-cart', produto);
// }
// </script>


<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <ProductCard v-for="product in produtos" :key="product.id" :product="product" @add="adicionarAoCarrinho" />
  </div>
</template>