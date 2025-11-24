<template>
  <!-- Sidebar do painel administrativo -->
  <aside class="w-64 bg-gray-900 min-h-screen text-white flex flex-col shadow-xl">
    <!-- Header -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
          <i class="fa-solid fa-shield-halved text-2xl"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold">Painel Admin</h2>
          <p class="text-xs text-gray-400">Gerenciamento</p>
        </div>
      </div>
    </div>

    <!-- Menu de navegação -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <!-- Dashboard -->
        <li>
          <router-link
            to="/admin/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800"
            :class="isActive('/admin/dashboard') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : ''">
            <i class="fa-solid fa-chart-line text-lg"></i>
            <span class="font-semibold">Dashboard</span>
          </router-link>
        </li>

        <!-- Pedidos -->
        <li>
          <router-link
            to="/admin/orders"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800"
            :class="isActive('/admin/orders') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : ''">
            <i class="fa-solid fa-box text-lg"></i>
            <span class="font-semibold">Pedidos</span>
          </router-link>
        </li>

        <!-- Produtos -->
        <li>
          <router-link
            to="/admin/products"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800"
            :class="isActive('/admin/products') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : ''">
            <i class="fa-solid fa-shirt text-lg"></i>
            <span class="font-semibold">Produtos</span>
          </router-link>
        </li>

        <!-- Categorias -->
        <li>
          <router-link
            to="/admin/categories"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800"
            :class="isActive('/admin/categories') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : ''">
            <i class="fa-solid fa-tags text-lg"></i>
            <span class="font-semibold">Categorias</span>
          </router-link>
        </li>

        <!-- Cupons -->
        <li>
          <router-link
            to="/admin/coupons"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800"
            :class="isActive('/admin/coupons') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : ''">
            <i class="fa-solid fa-ticket text-lg"></i>
            <span class="font-semibold">Cupons</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer com informações do usuário -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg">
        <div class="bg-gradient-to-br from-green-400 to-green-600 w-10 h-10 rounded-full flex items-center justify-center">
          <span class="text-lg font-bold">A</span>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-sm">{{ user.name }}</p>
          <p class="text-xs text-gray-400">{{ user.role === 'admin' ? 'Administrador' : 'Usuário' }}</p>
        </div>
      </div>
      
      <!-- Botão voltar para loja -->
      <router-link
        to="/"
        class="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
        <i class="fa-solid fa-arrow-left"></i>
        <span>Voltar para Loja</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const { user } = useAuth()

/**
 * Verifica se a rota está ativa
 */
function isActive(path) {
  return route.path.startsWith(path)
}
</script>
