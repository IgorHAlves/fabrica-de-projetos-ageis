<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 mb-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">
          <i class="fa-solid fa-plus-circle mr-3"></i>
          Cadastrar Novo Produto
        </h1>
        <p class="text-xl text-blue-100">Adicione um novo produto ao catálogo da loja</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-xl p-6 lg:p-10 border border-gray-100">
        <ProductFormComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductFormComponent from '../components/ProductFormComponent.vue'
</script>
