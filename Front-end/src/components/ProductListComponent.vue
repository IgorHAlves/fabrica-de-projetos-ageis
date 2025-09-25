<template>
    <div class="grid grind-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      // componentes e lógica para listar produtos  
    </div>
</template>

<script setup>
import ProductCard from './ProductCardComponent.vue'
defineProps(['produtos'])
const emit = defineEmits(['add'])

function adicionarAoCarrinho(produto) {
  emit('add', produto)
}
</script>