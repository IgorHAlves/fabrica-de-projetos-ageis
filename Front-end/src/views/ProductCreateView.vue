<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />
    
    <!-- Main Content -->
    <div class="flex-1 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">
              {{ productId ? 'Editar Produto' : 'Cadastrar Produto' }}
            </h1>
            <p class="text-gray-600">
              {{ productId ? 'Atualize os dados do produto' : 'Preencha os dados do novo produto' }}
            </p>
          </div>

          <!-- Form Component -->
          <ProductFormComponent :product-id="productId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminSidebar from '../components/AdminSidebar.vue';
import ProductFormComponent from '../components/ProductFormComponent.vue';

const route = useRoute();
const productId = computed(() => route.query.id || null);
</script>
