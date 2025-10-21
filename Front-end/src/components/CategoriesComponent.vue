<template>
  <div class="categories-container">
    <h2 class="text-2xl font-bold mb-4">Categorias</h2>
    
    <div v-if="loading" class="text-center">
      <p>Carregando categorias...</p>
    </div>
    
    <div v-else-if="error" class="text-red-500">
      <p>Erro ao carregar categorias: {{ error }}</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
      >
        <h3 class="font-semibold text-lg mb-2">{{ category.name }}</h3>
        <p class="text-gray-600">{{ category.description }}</p>
        <div class="mt-2 text-sm text-gray-500">
          ID: {{ category.id }}
        </div>
      </div>
    </div>
    
    <div v-if="categories.length === 0 && !loading" class="text-center text-gray-500">
      <p>Nenhuma categoria encontrada.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getCategories } from '../Services/CategoriesService'

export default {
  name: 'CategoriesComponent',
  setup() {
    const categories = ref([])
    const loading = ref(false)
    const error = ref(null)

    const loadCategories = async () => {
      loading.value = true
      error.value = null
      
      try {
        const data = await getCategories()
        categories.value = data
      } catch (err) {
        error.value = err.message || 'Erro desconhecido'
        console.error('Erro ao carregar categorias:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadCategories()
    })

    return {
      categories,
      loading,
      error,
      loadCategories
    }
  }
}
</script>

<style scoped>
.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
