<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Carrinho de Compras</h2>

    <div v-if="cartItems.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
      </svg>
      <p class="mt-2 text-gray-500">Seu carrinho está vazio</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="item in cartItems" :key="item.id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div class="flex items-center space-x-4">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-16 h-16 object-cover rounded-lg">
          <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="text-gray-600">R$ {{ item.price.toFixed(2) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="decreaseQuantity(item)"
            class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-8 text-center">{{ item.quantity }}</span>
          <button @click="increaseQuantity(item)"
            class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button @click="removeFromCart(item)" class="ml-4 text-red-600 hover:text-red-800">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div class="border-t pt-4">
        <div class="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span>R$ {{ totalPrice.toFixed(2) }}</span>
        </div>
        <button @click="checkout"
          class="w-full mt-4 bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors">
          Finalizar Compra
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAlerts } from '../composables/useAlerts'

const { showSuccess, showError, showConfirm, showSuccessToast } = useAlerts()

const cartItems = ref([])

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

function addToCart(product) {
  const existingItem = cartItems.value.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
    showSuccessToast(`${product.name} adicionado ao carrinho!`)
  } else {
    cartItems.value.push({ ...product, quantity: 1 })
    showSuccessToast(`${product.name} adicionado ao carrinho!`)
  }
}

function increaseQuantity(item) {
  item.quantity += 1
  showSuccessToast(`Quantidade de ${item.name} aumentada!`)
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity -= 1
    showSuccessToast(`Quantidade de ${item.name} diminuída!`)
  } else {
    removeFromCart(item)
  }
}

async function removeFromCart(item) {
  const result = await showConfirm(
    'Remover do Carrinho',
    `Tem certeza que deseja remover "${item.name}" do carrinho?`,
    'Sim, remover',
    'Cancelar'
  )

  if (result.isConfirmed) {
    const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      showSuccessToast(`${item.name} removido do carrinho!`)
    }
  }
}

async function checkout() {
  if (cartItems.value.length === 0) {
    showError('Carrinho Vazio', 'Adicione produtos ao carrinho antes de finalizar a compra.')
    return
  }

  const result = await showConfirm(
    'Finalizar Compra',
    `Confirma a compra de ${cartItems.value.length} item(ns) por R$ ${totalPrice.value.toFixed(2)}?`,
    'Sim, finalizar',
    'Cancelar'
  )

  if (result.isConfirmed) {
    // Simular processamento
    showSuccess('Compra Finalizada!', 'Sua compra foi processada com sucesso. Obrigado!')
    cartItems.value = []
  }
}

// Expor a função addToCart para uso em outros componentes
defineExpose({
  addToCart
})
</script>
