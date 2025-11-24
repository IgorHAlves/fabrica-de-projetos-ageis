<template>
    <!-- View do Carrinho de Compras -->
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Título da página -->
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Meu Carrinho</h1>

            <!-- Componente do carrinho -->
            <CartComponent />

            <!-- Link para continuar comprando -->
            <div class="mt-6 text-center">
                <router-link to="/produtos" class="text-gray-600 hover:text-gray-900 underline">
                    ← Continuar comprando
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import CartComponent from '../components/CartComponent.vue'
</script>