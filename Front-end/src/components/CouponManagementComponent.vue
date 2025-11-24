<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gerenciar Cupons</h2>
        <p class="text-gray-600 text-sm mt-1">Crie e gerencie cupons de desconto</p>
      </div>
      <button @click="showCreateModal = true"
        class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2 shadow-md hover:shadow-lg">
        <i class="fa-solid fa-plus"></i>
        Novo Cupom
      </button>
    </div>

    <!-- Estatísticas -->
    <div v-if="!isLoading && coupons.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Total de Cupons</p>
            <p class="text-2xl font-bold text-purple-700">{{ coupons.length }}</p>
          </div>
          <i class="fa-solid fa-ticket text-3xl text-purple-500"></i>
        </div>
      </div>
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Cupons Percentuais</p>
            <p class="text-2xl font-bold text-blue-700">{{ percentualCount }}</p>
          </div>
          <i class="fa-solid fa-percent text-3xl text-blue-500"></i>
        </div>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Cupons Valor Fixo</p>
            <p class="text-2xl font-bold text-green-700">{{ fixedValueCount }}</p>
          </div>
          <i class="fa-solid fa-dollar-sign text-3xl text-green-500"></i>
        </div>
      </div>
    </div>

    <!-- Estado de carregamento -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
      <p class="text-gray-600">Carregando cupons...</p>
    </div>

    <!-- Tabela de cupons -->
    <div v-else-if="coupons && coupons.length > 0" class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b-2 border-gray-200">
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Código</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valor do Desconto</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="coupon in coupons" :key="coupon.code"
            class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <i class="fa-solid fa-ticket text-purple-500 mr-2"></i>
                <span class="font-bold text-gray-900 text-lg">{{ coupon.code }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center"
                :class="coupon.categoryEnum === 1 || coupon.categoryEnum === 'percentual' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'">
                <i :class="coupon.categoryEnum === 1 || coupon.categoryEnum === 'percentual' 
                  ? 'fa-solid fa-percent mr-1' 
                  : 'fa-solid fa-dollar-sign mr-1'"></i>
                {{ coupon.categoryEnum === 1 || coupon.categoryEnum === 'percentual' ? 'Percentual' : 'Valor Fixo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-gray-900 font-semibold text-lg">
                {{ coupon.categoryEnum === 1 || coupon.categoryEnum === 'percentual' 
                  ? `${coupon.value}%` 
                  : `R$ ${coupon.value.toFixed(2)}` }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="handleDeleteCoupon(coupon.code)"
                class="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Deletar cupom" aria-label="Deletar cupom">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vazio -->
    <div v-else class="text-center py-12">
      <i class="fa-solid fa-ticket text-6xl text-gray-400 mb-4"></i>
      <p class="text-gray-500 text-lg font-medium">Nenhum cupom cadastrado</p>
      <p class="text-gray-400 text-sm mt-2">Clique em "Novo Cupom" para começar</p>
    </div>

    <!-- Modal de Criar Cupom -->
    <div v-if="showCreateModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="closeCreateModal">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-gray-900">Criar Novo Cupom</h3>
          <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="handleCreateCoupon" class="space-y-4">
          <!-- Código do Cupom -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Código do Cupom</label>
            <input v-model.trim="newCoupon.code" type="text" placeholder="Ex: DESCONTO10" required
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              :class="errors.code ? 'border-red-300' : ''" />
            <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>
          </div>

          <!-- Tipo de Desconto -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo de Desconto</label>
            <select v-model.number="newCoupon.categoryEnum" required
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option :value="1">Percentual (%)</option>
              <option :value="2">Valor Fixo (R$)</option>
            </select>
          </div>

          <!-- Valor do Desconto -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Valor do Desconto
              <span class="text-gray-500 text-xs">
                ({{ newCoupon.categoryEnum === 1 ? 'em porcentagem' : 'em reais' }})
              </span>
            </label>
            <input v-model.number="newCoupon.value" type="number" :min="newCoupon.categoryEnum === 1 ? 1 : 0.01" 
              :max="newCoupon.categoryEnum === 1 ? 100 : undefined" 
              :step="newCoupon.categoryEnum === 1 ? 1 : 0.01" required
              :placeholder="newCoupon.categoryEnum === 1 ? 'Ex: 10 (para 10%)' : 'Ex: 50.00'"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              :class="errors.value ? 'border-red-300' : ''" />
            <p v-if="errors.value" class="mt-1 text-sm text-red-600">{{ errors.value }}</p>
          </div>

          <!-- Botões -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeCreateModal"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" :disabled="isCreating"
              class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <i v-if="isCreating" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-check"></i>
              Criar Cupom
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCoupons, createCoupon, deleteCoupon } from '../Services/CouponsService'
import { useAlerts } from '../composables/useAlerts'

const { showSuccess, showError, showConfirm, showLoading, closeLoading } = useAlerts()

const coupons = ref([])
const isLoading = ref(false)
const isCreating = ref(false)
const showCreateModal = ref(false)
const errors = ref({})

const newCoupon = ref({
  code: '',
  value: null,
  categoryEnum: 1 // 1 = percentual, 2 = totalValue
})

// Estatísticas computadas
const percentualCount = computed(() => {
  return coupons.value.filter(c => c.categoryEnum === 1 || c.categoryEnum === 'percentual').length
})

const fixedValueCount = computed(() => {
  return coupons.value.filter(c => c.categoryEnum === 2 || c.categoryEnum === 'totalValue').length
})

/**
 * Carrega a lista de cupons
 */
async function loadCoupons() {
  isLoading.value = true
  try {
    const response = await getCoupons(1, 100)
    // Suporta tanto camelCase quanto PascalCase
    coupons.value = response.items || response.Items || []
    
    // Log para debug (apenas em desenvolvimento)
    if (import.meta.env.DEV && coupons.value.length === 0) {
      console.log('Nenhum cupom encontrado. Resposta da API:', response)
    }
  } catch (error) {
    console.error('Erro ao carregar cupons:', error)
    
    let errorMessage = 'Não foi possível carregar os cupons.'
    
    if (error.response) {
      // Erro da API
      if (error.response.status === 404) {
        errorMessage = 'Endpoint de cupons não encontrado. Verifique se a API está rodando.'
      } else if (error.response.status >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.'
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage = `Erro ao buscar cupons (${error.response.status}).`
      }
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      errorMessage = 'Tempo de espera esgotado. Verifique sua conexão.'
    } else if (error.message?.includes('Network Error') || error.message?.includes('ERR_NETWORK')) {
      errorMessage = 'Erro de conexão. Verifique se a API está rodando em https://localhost:7181'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    showError('Erro ao carregar cupons', errorMessage)
    coupons.value = []
  } finally {
    isLoading.value = false
  }
}

/**
 * Valida o formulário de criação
 */
function validateForm() {
  errors.value = {}
  
  if (!newCoupon.value.code || !newCoupon.value.code.trim()) {
    errors.value.code = 'Código do cupom é obrigatório'
    return false
  }

  if (newCoupon.value.code.length < 3) {
    errors.value.code = 'Código deve ter pelo menos 3 caracteres'
    return false
  }

  if (newCoupon.value.value === null || newCoupon.value.value === undefined) {
    errors.value.value = 'Valor do desconto é obrigatório'
    return false
  }

  if (newCoupon.value.categoryEnum === 1) {
    // Percentual: deve estar entre 1 e 100
    if (newCoupon.value.value < 1 || newCoupon.value.value > 100) {
      errors.value.value = 'Percentual deve estar entre 1% e 100%'
      return false
    }
  } else {
    // Valor fixo: deve ser maior que 0
    if (newCoupon.value.value <= 0) {
      errors.value.value = 'Valor deve ser maior que zero'
      return false
    }
  }

  return true
}

/**
 * Cria um novo cupom
 */
async function handleCreateCoupon() {
  if (!validateForm()) return

  isCreating.value = true
  showLoading('Criando cupom...')

  try {
    const couponData = {
      code: newCoupon.value.code.trim().toUpperCase(),
      value: Number(newCoupon.value.value),
      categoryEnum: Number(newCoupon.value.categoryEnum)
    }

    await createCoupon(couponData)
    
    closeLoading()
    showSuccess('Cupom criado!', 'O cupom foi criado com sucesso.')
    
    // Recarrega a lista
    await loadCoupons()
    
    // Fecha o modal e limpa o formulário
    closeCreateModal()
  } catch (error) {
    closeLoading()
    const errorMessage = error.response?.data?.message || error.message || 'Não foi possível criar o cupom.'
    showError('Erro ao criar cupom', errorMessage)
  } finally {
    isCreating.value = false
  }
}

/**
 * Deleta um cupom
 */
async function handleDeleteCoupon(code) {
  const result = await showConfirm(
    'Deletar Cupom',
    `Tem certeza que deseja deletar o cupom "${code}"? Esta ação não pode ser desfeita.`,
    'Sim, deletar',
    'Cancelar'
  )

  if (result.isConfirmed) {
    showLoading('Deletando cupom...')
    try {
      await deleteCoupon(code)
      closeLoading()
      showSuccess('Cupom deletado!', 'O cupom foi deletado com sucesso.')
      await loadCoupons()
    } catch (error) {
      closeLoading()
      const errorMessage = error.response?.data?.message || error.message || 'Não foi possível deletar o cupom.'
      showError('Erro ao deletar cupom', errorMessage)
    }
  }
}

/**
 * Fecha o modal e limpa o formulário
 */
function closeCreateModal() {
  showCreateModal.value = false
  newCoupon.value = {
    code: '',
    value: null,
    categoryEnum: 1
  }
  errors.value = {}
}

onMounted(() => {
  loadCoupons()
})
</script>


