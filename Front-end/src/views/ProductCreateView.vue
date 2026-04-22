<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <i class="fa-solid fa-plus-circle text-blue-600"></i>
          {{ productId ? 'Editar Produto' : 'Cadastrar Produto' }}
        </h1>
        <p class="text-gray-600">{{ productId ? 'Atualize os dados do produto' : 'Preencha os dados do novo produto' }}</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <ProductFormComponent :product-id="productId" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminSidebar from '../components/AdminSidebar.vue';
import ProductFormComponent from '../components/ProductFormComponent.vue';

const route = useRoute();
const productId = computed(() => {
    const id = route.query.id || null;

    return id;
});
</script>
