<template>
  <div class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <label class="block text-sm font-bold text-gray-900 flex items-center">
        <i class="fa-solid fa-ticket mr-2 text-purple-600"></i>
        Cupom de Desconto
      </label>
      <button v-if="appliedCoupon" @click="removeCoupon" 
        class="text-xs text-red-600 hover:text-red-800 font-semibold">
        Remover
      </button>
    </div>

    <!-- Cupom aplicado -->
    <div v-if="appliedCoupon" class="bg-white rounded-lg p-3 border-2 border-green-300">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-check-circle text-green-600"></i>
          <span class="font-semibold text-gray-900">{{ appliedCoupon.code }}</span>
          <span class="text-xs text-gray-600">
            ({{ appliedCoupon.categoryEnum === 1 || appliedCoupon.categoryEnum === 'percentual' 
              ? `${appliedCoupon.value}%` 
              : `R$ ${appliedCoupon.value.toFixed(2)}` }})
          </span>
        </div>
        <span class="text-green-600 font-bold">
          -R$ {{ discountValue.toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- Input para aplicar cupom -->
    <div v-else class="flex gap-2">
      <input 
        v-model="couponCode" 
        type="text" 
        placeholder="Digite o código do cupom"
        @keyup.enter="applyCoupon"
        class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
        :class="error ? 'border-red-300' : ''"
      />
      <button 
        @click="applyCoupon"
        :disabled="isLoading || !couponCode.trim()"
        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
        <i v-if="isLoading" class="fa-solid fa-spinner fa-spin"></i>
        <i v-else class="fa-solid fa-check"></i>
        Aplicar
      </button>
    </div>

    <!-- Mensagem de erro -->
    <p v-if="error" class="mt-2 text-sm text-red-600 font-medium flex items-center">
      <i class="fa-solid fa-exclamation-circle mr-2"></i>
      {{ error }}
    </p>

    <!-- Mensagem de sucesso -->
    <p v-if="successMessage" class="mt-2 text-sm text-green-600 font-medium flex items-center">
      <i class="fa-solid fa-check-circle mr-2"></i>
      {{ successMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { calculateDiscount, getCouponByCode } from '../Services/CouponsService'
import { useCart } from '../composables/useCart'

const props = defineProps({
  totalValue: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['coupon-applied', 'coupon-removed'])

const { appliedCoupon: storeCoupon } = useCart()

const couponCode = ref('')
const appliedCoupon = ref(null)
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

// Sincroniza com o cupom da store
watch(storeCoupon, (newCoupon) => {
  if (newCoupon) {
    appliedCoupon.value = newCoupon
  } else {
    appliedCoupon.value = null
  }
}, { immediate: true })

// Sincroniza quando o componente monta
onMounted(() => {
  if (storeCoupon.value) {
    appliedCoupon.value = storeCoupon.value
  }
})

// Calcula o valor do desconto
const discountValue = computed(() => {
  if (!appliedCoupon.value || !props.totalValue) return 0
  return calculateDiscount(appliedCoupon.value, props.totalValue)
})

// Limpa mensagens quando o cupom muda
watch(() => props.totalValue, () => {
  if (appliedCoupon.value) {
    // Recalcula desconto quando o total muda
    const newDiscount = calculateDiscount(appliedCoupon.value, props.totalValue)
    emit('coupon-applied', {
      coupon: appliedCoupon.value,
      discount: newDiscount
    })
  }
}, { immediate: false })

/**
 * Aplica um cupom
 */
async function applyCoupon() {
  if (!couponCode.value.trim()) {
    error.value = 'Digite um código de cupom'
    return
  }

  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const coupon = await getCouponByCode(couponCode.value.trim().toUpperCase())
    
    if (!coupon) {
      error.value = 'Cupom não encontrado'
      return
    }

    appliedCoupon.value = coupon
    couponCode.value = ''
    successMessage.value = 'Cupom aplicado com sucesso!'
    
    // Emite evento para o componente pai
    emit('coupon-applied', {
      coupon: coupon,
      discount: discountValue.value
    })

    // Limpa mensagem de sucesso após 3 segundos
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Erro ao aplicar cupom. Verifique o código e tente novamente.'
    
    if (import.meta.env.DEV) {
      console.error('Erro ao aplicar cupom:', err)
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Remove o cupom aplicado
 */
function removeCoupon() {
  appliedCoupon.value = null
  couponCode.value = ''
  error.value = ''
  successMessage.value = ''
  
  emit('coupon-removed')
}
</script>
