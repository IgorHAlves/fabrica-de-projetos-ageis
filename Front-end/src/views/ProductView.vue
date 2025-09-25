<script setup lang="ts">
import ProductCardComponent from '@/components/ProductCardComponent.vue';

</script>

<template>
    <div>
        <div class="max-w-7xl mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">Detalhes do Produto</h1>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-2">Nome do Produto</h2>
                <p class="text-gray-700 mb-4">Descrição detalhada do produto.</p>
                <p class="text-xl font-bold mb-4">R$ 99,99</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Adicionar ao Carrinho
                </button>
                <ProductCardComponent
                    v-for="product in [1,2,3]"
                    :key="product"
                    :product="product"
                    @add="console.log('Adicionar ao carrinho:', product)"></ProductCardComponent>
            </div>

        </div>
    </div>
</template>