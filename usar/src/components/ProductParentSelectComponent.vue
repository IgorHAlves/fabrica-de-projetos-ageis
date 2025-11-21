<template>
    <div class="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border-2 border-teal-100">
        <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-bold text-gray-900 flex items-center">
                <i class="fa-solid fa-sitemap mr-2 text-teal-600"></i>
                Produto Pai (Variação)
            </label>
            <button type="button" @click="toggleIsVariation"
                class="text-sm text-teal-600 hover:text-teal-700 font-semibold">
                {{ isVariation ? 'Remover variação' : 'Criar como variação' }}
            </button>
        </div>

        <div v-if="isVariation" class="space-y-3">
            <select v-model="selectedParentId" @change="handleParentChange" :class="[
                'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 appearance-none bg-white text-gray-900 font-medium',
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500'
            ]">
                <option value="">Selecione o produto pai</option>
                <option v-for="product in availableParents" :key="product.id" :value="product.id">
                    {{ product.name }} {{ product.stock !== undefined ? `(Estoque: ${product.stock})` : '' }}
                </option>
            </select>

            <p v-if="loading" class="text-sm text-teal-600 font-medium flex items-center">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Carregando produtos...
            </p>

            <p v-if="error" class="text-sm text-red-600 font-medium flex items-center">
                <i class="fa-solid fa-exclamation-circle mr-2"></i>
                {{ error }}
            </p>

            <div v-if="selectedParentId && selectedParent" class="bg-white rounded-lg p-4 border border-teal-200">
                <p class="text-xs text-gray-500 mb-1">Produto Pai Selecionado:</p>
                <p class="font-semibold text-gray-900">{{ selectedParent.name }}</p>
                <p class="text-sm text-gray-600 mt-1">Categoria: {{ selectedParent.category?.name || 'N/A' }}</p>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-xs text-blue-800 flex items-start">
                    <i class="fa-solid fa-info-circle mr-2 mt-0.5"></i>
                    <span>Uma variação herda a categoria do produto pai. Este produto será vinculado ao produto pai
                        selecionado.</span>
                </p>
            </div>
        </div>

        <p v-else class="text-sm text-gray-600 italic">
            Marque esta opção se este produto é uma variação de outro produto existente.
        </p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getProducts } from '@/Services/ProductsService'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: null
    },
    error: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const isVariation = ref(false)
const selectedParentId = ref('')
const availableParents = ref([])
const loading = ref(false)
const error = ref('')

const selectedParent = computed(() => {
    if (!selectedParentId.value) return null
    return availableParents.value.find(p => p.id === selectedParentId.value)
})

// Sincroniza com o modelValue
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        isVariation.value = true
        selectedParentId.value = newValue
    } else {
        isVariation.value = false
        selectedParentId.value = ''
    }
}, { immediate: true })

// Sincroniza selectedParentId com modelValue
watch(selectedParentId, (newValue) => {
    if (isVariation.value && newValue) {
        if (import.meta.env.DEV) {
            console.log('Atualizando idPai via watch:', newValue)
        }
        emit('update:modelValue', newValue || null)
    } else if (!isVariation.value) {
        emit('update:modelValue', null)
    }
})

function toggleIsVariation() {
    isVariation.value = !isVariation.value
    if (!isVariation.value) {
        selectedParentId.value = ''
        emit('update:modelValue', null)
    }
}

function handleParentChange() {
    const value = selectedParentId.value || null
    if (import.meta.env.DEV) {
        console.log('Produto pai selecionado:', value)
    }
    emit('update:modelValue', value)
}

async function loadAvailableParents() {
    loading.value = true
    error.value = ''

    try {
        // Busca produtos que não têm pai (podem ser pais de outros)
        const response = await getProducts(1, 100) // Busca mais produtos

        if (response.items && Array.isArray(response.items)) {
            // Filtra apenas produtos que não são variações (idPai === null)
            availableParents.value = response.items.filter(product =>
                !product.idPai || product.idPai === null
            )
        } else {
            availableParents.value = []
        }
    } catch (err) {
        error.value = 'Erro ao carregar produtos. Verifique a conexão com o backend.'
        availableParents.value = []
        if (import.meta.env.DEV) {
            console.error('Erro ao carregar produtos para variação:', err)
        }
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadAvailableParents()
})
</script>
