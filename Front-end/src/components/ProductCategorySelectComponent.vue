<template>
    <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <label for="category" class="block text-sm font-semibold text-gray-700 mb-3">Categoria</label>
        <select id="category" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 appearance-none bg-white">
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
import { ref, onMounted } from 'vue'
import { getCategories } from '@/Services/CategoriesService'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    error: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const categories = ref([])
const loading = ref(false)
const categoriesError = ref('')

async function loadCategories() {
    loading.value = true
    categoriesError.value = ''

    try {
        const data = await getCategories()
        categories.value = data || []
        console.log('Categorias carregadas com sucesso:', categories.value)
    } catch (error) {
        categoriesError.value = 'Erro ao carregar categorias'
        console.error('Erro ao carregar categorias:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadCategories()
})
</script>
