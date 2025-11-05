<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Cadastrar Produto</h1>
          <p class="text-gray-600">Preencha os dados do novo produto</p>
        </div>
        <ProductFormComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductFormComponent from '../components/ProductFormComponent.vue'
</script>
