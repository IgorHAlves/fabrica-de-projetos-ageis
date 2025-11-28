<template>
  <div v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
    @click.self="handleClose">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Cabeçalho -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">
          <i class="fa-solid fa-credit-card mr-2 text-purple-600"></i>
          Finalizar Compra
        </h2>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors">
          <i class="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <!-- Conteúdo -->
      <div class="p-6">
        <!-- Resumo do Pedido -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal:</span>
              <span class="text-gray-900">R$ {{ subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="discount > 0" class="flex justify-between text-green-600">
              <span>Desconto:</span>
              <span>-R$ {{ discount.toFixed(2) }}</span>
            </div>
            <div v-if="shipping > 0" class="flex justify-between">
              <span class="text-gray-600">Frete:</span>
              <span class="text-gray-900">R$ {{ shipping.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-gray-300 font-bold text-lg">
              <span>Total:</span>
              <span class="text-purple-600">R$ {{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Seleção de Método de Pagamento -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">Método de Pagamento</h3>
          <div class="grid grid-cols-2 gap-4">
            <button
              @click="paymentMethod = 'card'"
              :class="paymentMethod === 'card' 
                ? 'border-2 border-purple-600 bg-purple-50' 
                : 'border-2 border-gray-300 hover:border-purple-300'"
              class="p-4 rounded-lg transition-all">
              <i class="fa-solid fa-credit-card text-2xl mb-2" 
                :class="paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-400'"></i>
              <p class="font-semibold" :class="paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-700'">
                Cartão de Crédito
              </p>
            </button>
            <button
              @click="paymentMethod = 'pix'"
              :class="paymentMethod === 'pix' 
                ? 'border-2 border-purple-600 bg-purple-50' 
                : 'border-2 border-gray-300 hover:border-purple-300'"
              class="p-4 rounded-lg transition-all">
              <i class="fa-solid fa-qrcode text-2xl mb-2"
                :class="paymentMethod === 'pix' ? 'text-purple-600' : 'text-gray-400'"></i>
              <p class="font-semibold" :class="paymentMethod === 'pix' ? 'text-purple-600' : 'text-gray-700'">
                PIX
              </p>
            </button>
          </div>
        </div>

        <!-- Formulário de Cartão de Crédito -->
        <div v-if="paymentMethod === 'card'" class="space-y-4">
          <h3 class="font-semibold text-gray-900 mb-3">Dados do Cartão</h3>
          
          <!-- Nome no Cartão -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nome no Cartão</label>
            <input
              v-model="cardData.name"
              type="text"
              placeholder="Nome completo"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              :class="errors.name ? 'border-red-300' : ''"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Número do Cartão -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Número do Cartão</label>
            <input
              v-model="cardData.number"
              type="text"
              placeholder="0000 0000 0000 0000"
              maxlength="19"
              @input="formatCardNumber"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              :class="errors.number ? 'border-red-300' : ''"
            />
            <p v-if="errors.number" class="mt-1 text-sm text-red-600">{{ errors.number }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Validade -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Validade</label>
              <input
                v-model="cardData.expiry"
                type="text"
                placeholder="MM/AA"
                maxlength="5"
                @input="formatExpiry"
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                :class="errors.expiry ? 'border-red-300' : ''"
              />
              <p v-if="errors.expiry" class="mt-1 text-sm text-red-600">{{ errors.expiry }}</p>
            </div>

            <!-- CVV -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
              <input
                v-model="cardData.cvv"
                type="text"
                placeholder="123"
                maxlength="4"
                @input="formatCVV"
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                :class="errors.cvv ? 'border-red-300' : ''"
              />
              <p v-if="errors.cvv" class="mt-1 text-sm text-red-600">{{ errors.cvv }}</p>
            </div>
          </div>
        </div>

        <!-- Informações PIX -->
        <div v-if="paymentMethod === 'pix'" class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 text-center">
          <i class="fa-solid fa-qrcode text-5xl text-green-600 mb-4"></i>
          <h3 class="font-bold text-gray-900 mb-2">Pagamento via PIX</h3>
          <p class="text-gray-600 text-sm mb-4">
            O código PIX será gerado após a confirmação do pedido.
          </p>
          <div class="bg-white rounded-lg p-4 border border-green-200">
            <p class="text-xs text-gray-500 mb-1">Valor a pagar</p>
            <p class="text-2xl font-bold text-green-600">R$ {{ total.toFixed(2) }}</p>
          </div>
        </div>

        <!-- Mensagens de Erro -->
        <div v-if="paymentError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600 flex items-center">
            <i class="fa-solid fa-exclamation-circle mr-2"></i>
            {{ paymentError }}
          </p>
        </div>

        <!-- Botões -->
        <div class="flex gap-3 mt-6 pt-6 border-t">
          <button
            @click="handleClose"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
            Cancelar
          </button>
          <button
            @click="handlePayment"
            :disabled="isProcessing"
            class="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <i v-if="isProcessing" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-lock"></i>
            {{ isProcessing ? 'Processando...' : 'Confirmar Pagamento' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAlerts } from '../composables/useAlerts'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const { showLoading, closeLoading, showSuccess, showError } = useAlerts()

const paymentMethod = ref('card')
const isProcessing = ref(false)
const paymentError = ref('')

const cardData = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
})

const errors = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
})

// Limpa erros quando muda o método de pagamento
watch(paymentMethod, () => {
  paymentError.value = ''
  errors.value = { name: '', number: '', expiry: '', cvv: '' }
})

// Limpa formulário quando fecha o modal
watch(() => props.show, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

/**
 * Formata número do cartão (adiciona espaços)
 */
function formatCardNumber(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length > 16) value = value.slice(0, 16)
  
  // Adiciona espaços a cada 4 dígitos
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
  cardData.value.number = value
}

/**
 * Formata data de validade (MM/AA)
 */
function formatExpiry(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  cardData.value.expiry = value
}

/**
 * Formata CVV (apenas números)
 */
function formatCVV(event) {
  cardData.value.cvv = event.target.value.replace(/\D/g, '').slice(0, 4)
}

/**
 * Valida dados do cartão (validação fake)
 */
function validateCard() {
  errors.value = { name: '', number: '', expiry: '', cvv: '' }
  let isValid = true

  // Valida nome
  if (!cardData.value.name || cardData.value.name.trim().length < 3) {
    errors.value.name = 'Nome deve ter pelo menos 3 caracteres'
    isValid = false
  }

  // Valida número do cartão (deve ter 16 dígitos)
  const cardNumber = cardData.value.number.replace(/\D/g, '')
  if (cardNumber.length !== 16) {
    errors.value.number = 'Número do cartão deve ter 16 dígitos'
    isValid = false
  } else {
    // Validação fake: aceita qualquer número que comece com 4, 5 ou 3
    const firstDigit = cardNumber[0]
    if (!['4', '5', '3'].includes(firstDigit)) {
      errors.value.number = 'Número de cartão inválido (aceita apenas Visa, Mastercard ou Amex)'
      isValid = false
    }
  }

  // Valida validade (formato MM/AA)
  const expiry = cardData.value.expiry.replace(/\D/g, '')
  if (expiry.length !== 4) {
    errors.value.expiry = 'Data de validade inválida'
    isValid = false
  } else {
    const month = parseInt(expiry.slice(0, 2))
    const year = parseInt('20' + expiry.slice(2))
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    if (month < 1 || month > 12) {
      errors.value.expiry = 'Mês inválido'
      isValid = false
    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
      errors.value.expiry = 'Cartão expirado'
      isValid = false
    }
  }

  // Valida CVV (deve ter 3 ou 4 dígitos)
  if (cardData.value.cvv.length < 3 || cardData.value.cvv.length > 4) {
    errors.value.cvv = 'CVV inválido'
    isValid = false
  }

  return isValid
}

/**
 * Valida PIX (sempre válido, é fake)
 */
function validatePix() {
  return true
}

/**
 * Processa o pagamento
 */
async function handlePayment() {
  paymentError.value = ''
  
  // Valida conforme o método de pagamento
  let isValid = false
  if (paymentMethod.value === 'card') {
    isValid = validateCard()
  } else if (paymentMethod.value === 'pix') {
    isValid = validatePix()
  }

  if (!isValid) {
    paymentError.value = 'Por favor, corrija os erros no formulário'
    return
  }

  isProcessing.value = true
  showLoading('Processando pagamento...')

  try {
    // Simula processamento do pagamento (fake)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simula validação fake do pagamento
    const paymentSuccess = Math.random() > 0.1 // 90% de chance de sucesso (fake)

    if (!paymentSuccess) {
      closeLoading()
      paymentError.value = 'Pagamento recusado. Tente novamente ou use outro método.'
      isProcessing.value = false
      return
    }

    closeLoading()
    
    // Emite evento de confirmação para o componente pai processar o pedido
    // Nota: A API pode exigir autenticação. Se receber erro 401, será tratado no componente pai
    emit('confirm', {
      paymentMethod: paymentMethod.value,
      paymentData: paymentMethod.value === 'card' ? {
        last4: cardData.value.number.slice(-4),
        brand: getCardBrand(cardData.value.number)
      } : null
    })

  } catch (error) {
    closeLoading()
    paymentError.value = 'Erro ao processar pagamento. Tente novamente.'
    isProcessing.value = false
  }
}

/**
 * Identifica a bandeira do cartão (fake)
 */
function getCardBrand(cardNumber) {
  const number = cardNumber.replace(/\D/g, '')
  if (number.startsWith('4')) return 'Visa'
  if (number.startsWith('5')) return 'Mastercard'
  if (number.startsWith('3')) return 'Amex'
  return 'Cartão'
}

/**
 * Reseta o formulário
 */
function resetForm() {
  cardData.value = { name: '', number: '', expiry: '', cvv: '' }
  errors.value = { name: '', number: '', expiry: '', cvv: '' }
  paymentError.value = ''
  paymentMethod.value = 'card'
  isProcessing.value = false
}

/**
 * Fecha o modal
 */
function handleClose() {
  if (!isProcessing.value) {
    emit('close')
  }
}
</script>
