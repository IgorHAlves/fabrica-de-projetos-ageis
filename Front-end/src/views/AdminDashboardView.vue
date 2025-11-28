<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Conteúdo principal -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">Bem-vindo ao Painel Admin</h1>
        <p class="text-xl text-gray-600">Gerencie seu e-commerce de forma simples e eficiente</p>
      </div>

      <!-- Ações principais em grade -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <router-link
          to="/admin/products"
          class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
          <i class="fa-solid fa-box text-5xl mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Produtos</h3>
          <p class="text-blue-100">Gerenciar catálogo</p>
        </router-link>

        <router-link
          to="/admin/orders"
          class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
          <i class="fa-solid fa-shopping-bag text-5xl mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Pedidos</h3>
          <p class="text-green-100">Ver todos os pedidos</p>
        </router-link>

        <router-link
          to="/admin/categories"
          class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
          <i class="fa-solid fa-tags text-5xl mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Categorias</h3>
          <p class="text-purple-100">Organizar produtos</p>
        </router-link>

        <router-link
          to="/admin/coupons"
          class="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
          <i class="fa-solid fa-ticket text-5xl mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Cupons</h3>
          <p class="text-orange-100">Criar descontos</p>
        </router-link>

        <router-link
          to="/admin/products/create"
          class="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
          <i class="fa-solid fa-plus-circle text-5xl mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Novo Produto</h3>
          <p class="text-pink-100">Adicionar ao catálogo</p>
        </router-link>

        <router-link
          to="/"
          class="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
          <i class="fa-solid fa-store text-5xl mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Voltar à Loja</h3>
          <p class="text-gray-300">Ver como cliente</p>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '../components/AdminSidebar.vue';
</script>
