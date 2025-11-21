<template>
    <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border-2 border-indigo-100">
        <label for="category" class="block text-sm font-bold text-gray-900 mb-3 flex items-center">
            <i class="fa-solid fa-layer-group mr-2 text-indigo-600"></i>
            Categoria <span class="text-red-500 ml-1">*</span>
        </label>
        <select id="category" :value="modelValue" @input="handleCategoryChange" @blur="$emit('blur')"
            :required="!disabled" :disabled="disabled" :class="[
                'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 appearance-none text-gray-900 font-medium',
                disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white',
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
            ]">
            <option disabled value="">Selecione uma categoria</option>
            <option v-for="category in categories" :key="category.id" :value="Number(category.id)">
                {{ category.name }}
            </option>
        </select>
        <p v-if="loading" class="mt-2 text-sm text-indigo-600 font-medium flex items-center">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>
            Carregando categorias...
        </p>
        <p v-if="error" class="mt-2 text-sm text-red-600 font-medium flex items-center">
            <i class="fa-solid fa-exclamation-circle mr-2"></i>
            {{ error }}
        </p>
        <p v-if="categoriesError" class="mt-2 text-sm text-red-600 font-medium flex items-center">
            <i class="fa-solid fa-exclamation-triangle mr-2"></i>
            {{ categoriesError }}
        </p>
        <div v-if="disabled" class="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-xs text-yellow-800 flex items-center">
                <i class="fa-solid fa-info-circle mr-2"></i>
                A categoria será herdada automaticamente do produto pai quando você criar uma variação.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategories } from '@/Services/CategoriesService'

// Props do componente
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    error: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'blur'])

// Estado local do componente
const categories = ref([])
const loading = ref(false)
const categoriesError = ref('')

/**
 * Handler para mudança de categoria
 * Garante que o valor seja sempre um número válido
 */
function handleCategoryChange(event) {
    const selectedValue = event.target.value

    // Se estiver vazio, emite string vazia
    if (!selectedValue || selectedValue === '') {
        emit('update:modelValue', '')
        return
    }

    // Converte para número e valida
    const categoryId = Number(selectedValue)

    // Verifica se a categoria existe na lista carregada
    const categoryExists = categories.value.some(cat => Number(cat.id) === categoryId)

    if (isNaN(categoryId) || !categoryExists) {
        // Se não existe, limpa a seleção
        emit('update:modelValue', '')
        categoriesError.value = 'Categoria selecionada não é válida. Por favor, selecione novamente.'
        return
    }

    // Emite o valor como número
    emit('update:modelValue', categoryId)
}

/**
 * Carrega as categorias da API
 * Trata erros de conexão e outros erros
 */
async function loadCategories() {
    loading.value = true
    categoriesError.value = ''

    try {
        // Busca categorias usando o service
        const data = await getCategories()

        // Verifica se retornou dados válidos
        if (Array.isArray(data) && data.length > 0) {
            categories.value = data
        } else {
            // Se não há categorias, mantém array vazio
            categories.value = []
            // Só mostra erro se realmente houve problema (não apenas lista vazia)
            if (!data || data.length === 0) {
                categoriesError.value = 'Nenhuma categoria disponível. Verifique se o backend está rodando.'
            }
        }
    } catch (error) {
        // Trata erros não capturados pelo service
        categoriesError.value = 'Erro ao carregar categorias. Verifique a conexão com o backend.'
        categories.value = [] // Garante que seja um array
    } finally {
        loading.value = false
    }
}

// Carrega categorias quando o componente é montado
onMounted(() => {
    loadCategories()
})
</script>
