<template>
  <!-- Container principal do carrinho -->
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Carrinho de Compras</h2>

    <!-- Estado vazio: mostra quando não há itens no carrinho -->
    <div v-if="isEmpty" class="text-center py-8">
      <i class="fa-solid fa-cart-shopping mx-auto text-6xl text-gray-400"></i>
      <p class="mt-4 text-gray-500 text-lg">Seu carrinho está vazio</p>
    </div>

    <!-- Lista de itens do carrinho -->
    <div v-else class="space-y-4">
      <!-- Loop pelos itens do carrinho -->
      <div v-for="item in items" :key="item.id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">

        <!-- Informações do produto (imagem e detalhes) -->
        <div class="flex items-center space-x-4 flex-1">
          <!-- Imagem do produto ou placeholder -->
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-16 h-16 object-cover rounded-lg">
          <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Nome e preço do produto -->
          <div>
            <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="text-gray-600">R$ {{ item.price.toFixed(2) }}</p>
            <p class="text-sm text-gray-500">Subtotal: R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>

        <!-- Controles de quantidade e remoção -->
        <div class="flex items-center space-x-2">
          <!-- Botão para diminuir quantidade -->
          <button @click="decreaseQuantity(item.id)"
            class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            aria-label="Diminuir quantidade">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>

          <!-- Quantidade atual -->
          <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>

          <!-- Botão para aumentar quantidade -->
          <button @click="increaseQuantity(item.id)"
            class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            aria-label="Aumentar quantidade">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          <!-- Botão para remover item -->
          <button @click="removeFromCart(item.id)" class="ml-4 text-red-600 hover:text-red-800 transition-colors"
            title="Remover do carrinho" aria-label="Remover do carrinho">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Resumo e botão de finalizar compra -->
      <div class="border-t pt-4 mt-6">
        <!-- Total de itens e valor total -->
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-600">Total de itens:</span>
          <span class="font-semibold">{{ totalItems }}</span>
        </div>
        <div class="flex justify-between items-center text-lg font-semibold mb-4">
          <span>Total:</span>
          <span class="text-2xl text-gray-900">R$ {{ totalPrice.toFixed(2) }}</span>
        </div>

        <!-- Botão para finalizar compra -->
        <button @click="handleCheckout"
          class="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors font-semibold"
          aria-label="Finalizar compra">
          Finalizar Compra
        </button>
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
