<template>
    <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <label for="category" class="block text-sm font-semibold text-gray-700 mb-3">Categoria</label>
        <select id="category" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" 
            @blur="$emit('blur')"
            :disabled="disabled" :required="!disabled"
            :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 appearance-none',
                disabled 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                    : 'bg-white border-gray-300 focus:ring-gray-400 focus:border-gray-400'
            ]">
            <option disabled value="">Selecione uma categoria</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
            </option>
        </select>
        <p v-if="error" class="mt-2 text-sm text-red-600 font-medium">{{ error }}</p>
        <p v-if="loading" class="mt-2 text-sm text-gray-600 font-medium">Carregando categorias...</p>
        <p v-if="categoriesError" class="mt-2 text-sm text-red-600 font-medium">{{ categoriesError }}</p>
    </div>
</template>

<script setup>
import { getCategories } from '@/Services/CategoriesService'
import { onMounted, ref } from 'vue'

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

const emit = defineEmits(['update:modelValue'])

// Estado local do componente
const categories = ref([])
const loading = ref(false)
const categoriesError = ref('')

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
