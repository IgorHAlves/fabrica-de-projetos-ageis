<template>
  <!-- Container principal do carrinho -->
  <div class="bg-white rounded-xl shadow-lg p-6 lg:p-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold text-gray-900">
        <i class="fa-solid fa-cart-shopping mr-3 text-blue-600"></i>
        Carrinho de Compras
      </h2>
      <span v-if="!isEmpty" class="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-semibold">
        {{ totalItems }} {{ totalItems === 1 ? 'item' : 'itens' }}
      </span>
    </div>

    <!-- Estado vazio: mostra quando não há itens no carrinho -->
    <div v-if="isEmpty" class="text-center py-16">
      <div
        class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
        <i class="fa-solid fa-cart-shopping text-6xl text-gray-300"></i>
      </div>
      <p class="mt-4 text-gray-500 text-xl font-medium">Seu carrinho está vazio</p>
      <p class="mt-2 text-gray-400">Adicione produtos ao carrinho para começar a comprar</p>
      <router-link to="/produtos"
        class="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
        <i class="fa-solid fa-store mr-2"></i>
        Explorar Produtos
      </router-link>
    </div>

    <!-- Lista de itens do carrinho -->
    <div v-else class="space-y-4">
      <!-- Loop pelos itens do carrinho -->
      <div v-for="item in items" :key="item.id"
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50">

        <!-- Informações do produto (imagem e detalhes) - clicável -->
        <router-link :to="`/productDetail/${item.id}`"
          class="flex items-center space-x-4 flex-1 w-full sm:w-auto cursor-pointer group hover:opacity-90 transition-opacity">
          <!-- Imagem do produto ou placeholder -->
          <div class="relative">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name"
              class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <div v-else
              class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <i class="fa-solid fa-image text-3xl text-gray-400"></i>
            </div>
            <!-- Indicador de clique -->
            <div class="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300 flex items-center justify-center">
              <i class="fa-solid fa-external-link-alt text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm"></i>
            </div>
          </div>

          <!-- Nome e preço do produto -->
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
              {{ item.name }}
            </h3>
            <p class="text-blue-600 font-semibold text-base mb-1">R$ {{ item.price.toFixed(2) }}</p>
            <p class="text-sm text-gray-500">
              Estoque: {{ item.stock !== undefined ? item.stock : 'Indisponível' }}
              <i class="fa-solid fa-arrow-right ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </p>
          </div>
        </router-link>

        <!-- Controles de quantidade e remoção -->
        <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <!-- Controles de quantidade -->
          <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
            <!-- Botão para diminuir quantidade -->
            <button @click="decreaseQuantity(item.id)"
              class="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow"
              aria-label="Diminuir quantidade">
              <i class="fa-solid fa-minus text-xs text-gray-700"></i>
            </button>

            <!-- Quantidade atual -->
            <span class="w-12 text-center font-bold text-gray-900">{{ item.quantity }}</span>

            <!-- Botão para aumentar quantidade -->
            <button @click="increaseQuantity(item.id)"
              class="w-8 h-8 rounded-lg bg-white hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow"
              aria-label="Aumentar quantidade">
              <i class="fa-solid fa-plus text-xs text-gray-700"></i>
            </button>
          </div>

          <!-- Subtotal e remoção -->
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-xs text-gray-500 mb-1">Subtotal</p>
              <p class="text-lg font-bold text-gray-900">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>

            <!-- Botão para remover item -->
            <button @click="removeFromCart(item.id)"
              class="w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
              title="Remover do carrinho" aria-label="Remover do carrinho">
              <i class="fa-solid fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Resumo e botão de finalizar compra -->
      <div class="border-t-2 border-gray-200 pt-6 mt-6 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6">
        <!-- Totais -->
        <div class="space-y-3 mb-6">
          <div class="flex justify-between items-center text-gray-600">
            <span class="text-lg">Total de itens:</span>
            <span class="font-semibold text-xl text-gray-900">{{ totalItems }} {{ totalItems === 1 ? 'item' : 'itens'
              }}</span>
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-gray-200">
            <span class="text-2xl font-bold text-gray-900">Total a pagar:</span>
            <span class="text-3xl font-extrabold text-blue-600">R$ {{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Botão para finalizar compra -->
        <button @click="handleCheckout"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          aria-label="Finalizar compra">
          <i class="fa-solid fa-credit-card"></i>
          Finalizar Compra
        </button>

        <!-- Link para continuar comprando -->
        <router-link to="/produtos"
          class="mt-4 block text-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
          <i class="fa-solid fa-arrow-left mr-2"></i>
          Continuar Comprando
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '../composables/useCart'

// Usa o composable do carrinho para acessar a store
const {
  items,           // Lista de itens no carrinho
  totalItems,      // Total de itens (soma das quantidades)
  totalPrice,      // Valor total do carrinho
  isEmpty,         // Verifica se está vazio
  removeFromCart,  // Função para remover item
  increaseQuantity, // Função para aumentar quantidade
  decreaseQuantity, // Função para diminuir quantidade
  checkout         // Função para finalizar compra
} = useCart()

/**
 * Handler para finalizar a compra
 * Chama a função checkout da store
 */
async function handleCheckout() {
  await checkout()
}
</script>
