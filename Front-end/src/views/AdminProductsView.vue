<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex">
    <!-- Sidebar -->
    <AdminSidebar />
    <!-- Main Content -->
    <div class="flex-1 mx-auto">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-box text-blue-600"></i>
                Gerenciar Produtos
              </h1>
              <p class="text-gray-600 mt-1">Cadastre e gerencie produtos da loja</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <ProductFormComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '../components/AdminSidebar.vue';
import ProductFormComponent from '../components/ProductFormComponent.vue';
</script>
