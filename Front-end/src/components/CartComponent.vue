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

      <!-- Componente de Cupom -->
      <CouponComponent 
        :total-value="totalPrice" 
        @coupon-applied="handleCouponApplied"
        @coupon-removed="handleCouponRemoved"
      />

      <!-- Componente de Frete -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <label class="block text-sm font-bold text-gray-900 flex items-center">
            <i class="fa-solid fa-truck mr-2 text-blue-600"></i>
            Calcular Frete
          </label>
          <button v-if="safeShippingPrice > 0" @click="handleRemoveShipping" 
            class="text-xs text-red-600 hover:text-red-800 font-semibold">
            Remover
          </button>
        </div>

        <!-- Frete calculado -->
        <div v-if="safeShippingPrice > 0 && safeShippingAddress" class="bg-white rounded-lg p-3 border-2 border-green-300 mb-3">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-check-circle text-green-600"></i>
              <span class="font-semibold text-gray-900">Frete calculado</span>
            </div>
            <div class="text-sm text-gray-600 pl-6">
              <p><strong>CEP:</strong> {{ formatCep(safeShippingCep) }}</p>
              <p v-if="safeShippingAddress && safeShippingAddress.uf">
                <strong>Estado:</strong> {{ safeShippingAddress.uf }}
              </p>
              <p v-if="safeShippingAddress && safeShippingAddress.logradouro">
                <strong>Endereço:</strong> {{ safeShippingAddress.logradouro }}
              </p>
              <p v-if="safeShippingAddress && safeShippingAddress.bairro">
                <strong>Bairro:</strong> {{ safeShippingAddress.bairro }}
              </p>
            </div>
            <div class="flex justify-between items-center pt-2 border-t">
              <span class="font-semibold text-gray-900">Valor do Frete:</span>
              <span class="text-green-600 font-bold text-lg">R$ {{ safeShippingPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Input para calcular frete -->
        <div v-else class="flex gap-2">
          <input 
            v-model="cepInput" 
            type="text" 
            placeholder="Digite o CEP (ex: 12345-678)"
            @keyup.enter="handleCalculateShipping"
            maxlength="9"
            class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            :class="safeCepError ? 'border-red-300' : ''"
          />
          <button 
            @click="handleCalculateShipping"
            :disabled="safeIsCalculatingShipping || !safeCepInput || !safeCepInput.trim()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <i v-if="safeIsCalculatingShipping" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-search"></i>
            Calcular
          </button>
        </div>

        <!-- Mensagem de erro -->
        <p v-if="safeCepError" class="mt-2 text-sm text-red-600 font-medium flex items-center">
          <i class="fa-solid fa-exclamation-circle mr-2"></i>
          {{ safeCepError }}
        </p>
      </div>

      <!-- Resumo e botão de finalizar compra -->
      <div class="border-t pt-4 mt-6">
        <!-- Total de itens e valor total -->
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-600">Total de itens:</span>
          <span class="font-semibold">{{ totalItems }}</span>
        </div>
        
        <!-- Subtotal -->
        <div class="flex justify-between items-center mb-1">
          <span class="text-gray-600">Subtotal:</span>
          <span class="text-gray-900">R$ {{ totalPrice.toFixed(2) }}</span>
        </div>
        
        <!-- Desconto (se houver) -->
        <div v-if="discountValue > 0" class="flex justify-between items-center mb-1 text-green-600">
          <span class="text-gray-600">Desconto:</span>
          <span class="font-semibold">-R$ {{ discountValue.toFixed(2) }}</span>
        </div>

        <!-- Frete (se houver) -->
        <div v-if="safeShippingPrice > 0" class="flex justify-between items-center mb-1">
          <span class="text-gray-600">Frete:</span>
          <span class="text-gray-900">R$ {{ safeShippingPrice.toFixed(2) }}</span>
        </div>
        
        <!-- Total final -->
        <div class="flex justify-between items-center text-lg font-semibold mb-4 pt-2 border-t">
          <span>Total:</span>
          <span class="text-2xl text-gray-900">R$ {{ totalPriceWithDiscount.toFixed(2) }}</span>
        </div>

        <!-- Botão para finalizar compra -->
        <button @click="handleCheckout"
          class="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors font-semibold"
          aria-label="Finalizar compra">
          <i class="fa-solid fa-shopping-bag mr-2"></i>
          Finalizar Compra
        </button>
      </div>
    </div>

    <!-- Modal de Checkout -->
    <CheckoutModal
      :show="showCheckoutModal"
      :subtotal="totalPrice"
      :discount="discountValue"
      :shipping="safeShippingPrice"
      :total="totalPriceWithDiscount"
      @close="handleCloseCheckoutModal"
      @confirm="handleConfirmPayment"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCart } from '../composables/useCart'
import CouponComponent from './CouponComponent.vue'
import CheckoutModal from './CheckoutModal.vue'

// Usa o composable do carrinho para acessar a store
const {
  items,           // Lista de itens no carrinho
  totalItems,      // Total de itens (soma das quantidades)
  totalPrice,      // Valor total do carrinho
  totalPriceWithDiscount, // Valor total com desconto
  discountValue,   // Valor do desconto
  shippingPrice,   // Valor do frete
  shippingAddress, // Endereço do frete
  shippingCep,     // CEP informado
  isEmpty,         // Verifica se está vazio
  removeFromCart,  // Função para remover item
  increaseQuantity, // Função para aumentar quantidade
  decreaseQuantity, // Função para diminuir quantidade
  applyCoupon,     // Função para aplicar cupom
  removeCoupon,    // Função para remover cupom
  calculateShipping, // Função para calcular frete
  removeShipping,  // Função para remover frete
  checkout         // Função para finalizar compra
} = useCart()

// Estado do input de CEP - inicializa com valores padrão seguros
const cepInput = ref('')
const cepError = ref('')
const isCalculatingShipping = ref(false)

// Estado do modal de checkout
const showCheckoutModal = ref(false)

// Computed para garantir valores seguros durante hot reload
const safeCepInput = computed(() => cepInput.value || '')
const safeCepError = computed(() => cepError.value || '')
const safeIsCalculatingShipping = computed(() => isCalculatingShipping.value || false)
const safeShippingPrice = computed(() => {
  if (!shippingPrice || typeof shippingPrice.value === 'undefined') return 0
  return shippingPrice.value
})
const safeShippingAddress = computed(() => shippingAddress?.value || null)
const safeShippingCep = computed(() => shippingCep?.value || '')

// Formata CEP para exibição (12345-678)
function formatCep(cep) {
  if (!cep) return ''
  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length === 8) {
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`
  }
  return cep
}

// Formata CEP enquanto digita (adiciona hífen automaticamente)
watch(cepInput, (newValue) => {
  if (!newValue) return
  
  // Remove tudo que não é número
  const numbers = newValue.replace(/\D/g, '')
  
  // Limita a 8 dígitos
  if (numbers.length <= 8) {
    // Formata com hífen: 12345-678
    if (numbers.length > 5) {
      cepInput.value = `${numbers.slice(0, 5)}-${numbers.slice(5)}`
    } else {
      cepInput.value = numbers
    }
  }
  
  // Limpa erro quando o usuário começa a digitar
  if (cepError && cepError.value) {
    cepError.value = ''
  }
})

/**
 * Calcula o frete
 */
async function handleCalculateShipping() {
  if (!cepInput.value || !cepInput.value.trim()) {
    cepError.value = 'Por favor, informe um CEP'
    return
  }

  const cleanCep = cepInput.value.replace(/\D/g, '')
  if (cleanCep.length !== 8) {
    cepError.value = 'CEP deve conter 8 dígitos'
    return
  }

  isCalculatingShipping.value = true
  cepError.value = ''

  try {
    const success = await calculateShipping(cleanCep)
    if (success) {
      // Limpa o input após calcular com sucesso
      cepInput.value = ''
    }
  } catch (error) {
    cepError.value = 'Erro ao calcular frete. Tente novamente.'
  } finally {
    isCalculatingShipping.value = false
  }
}

/**
 * Remove o frete calculado
 */
function handleRemoveShipping() {
  removeShipping()
  cepInput.value = ''
  cepError.value = ''
}

/**
 * Handler para quando um cupom é aplicado
 */
function handleCouponApplied({ coupon, discount }) {
  applyCoupon(coupon)
}

/**
 * Handler para quando um cupom é removido
 */
function handleCouponRemoved() {
  removeCoupon()
}

/**
 * Handler para finalizar a compra
 * Abre o modal de checkout
 */
function handleCheckout() {
  if (isEmpty.value) {
    return
  }
  showCheckoutModal.value = true
}

/**
 * Handler quando o modal de checkout é fechado
 */
function handleCloseCheckoutModal() {
  showCheckoutModal.value = false
}

/**
 * Handler quando o pagamento é confirmado no modal
 * Processa o pedido na API
 */
async function handleConfirmPayment(paymentInfo) {
  showCheckoutModal.value = false
  
  // Chama a função checkout da store que faz o POST na API
  const success = await checkout()
  
  if (success) {
    // Mostra mensagem de sucesso com informações do pagamento
    const paymentMethodName = paymentInfo.paymentMethod === 'card' ? 'Cartão de Crédito' : 'PIX'
    const paymentDetails = paymentInfo.paymentMethod === 'card' && paymentInfo.paymentData
      ? ` (${paymentInfo.paymentData.brand} terminado em ${paymentInfo.paymentData.last4})`
      : ''
    
    // A mensagem de sucesso já é mostrada pela store, mas podemos adicionar detalhes do pagamento
    console.log(`Pagamento processado via ${paymentMethodName}${paymentDetails}`)
  }
}
</script>
