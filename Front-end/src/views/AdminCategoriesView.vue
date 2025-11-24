<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <i class="fa-solid fa-tags text-purple-600"></i>
            Categorias
          </h1>
          <p class="text-gray-600">Gerencie as categorias dos seus produtos</p>
        </div>
        <button @click="openCreateModal"
          class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-md flex items-center gap-2">
          <i class="fa-solid fa-plus"></i>
          Nova Categoria
        </button>
      </div>

      <!-- Category List -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-800">Categorias Cadastradas</h2>
        </div>
        
        <div v-if="isLoading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p class="mt-2 text-gray-500">Carregando categorias...</p>
        </div>

        <div v-else-if="categories.length === 0" class="p-12 text-center text-gray-500">
          <i class="fa-solid fa-tags text-4xl mb-3 block text-gray-300"></i>
          Nenhuma categoria cadastrada.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ category.name }}</td>
                <td class="px-6 py-4 text-gray-600">{{ category.description || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center space-x-4">
                  <button @click="openEditModal(category)" class="text-blue-600 hover:text-blue-800 transition" title="Editar">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="handleDelete(category)" class="text-red-600 hover:text-red-800 transition" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal (Create/Edit) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
            <input v-model.trim="form.name" type="text" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: Eletrônicos" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea v-model.trim="form.description" rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="Descrição da categoria..."></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition">
              Cancelar
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition disabled:opacity-50 flex justify-center items-center gap-2">
              <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
              {{ isEditing ? 'Salvar Alterações' : 'Criar Categoria' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import { useAlerts } from '../composables/useAlerts'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../Services/CategoryService'

const { showSuccess, showError, showConfirm } = useAlerts()

const categories = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  description: ''
})

async function fetchCategories() {
  isLoading.value = true
  try {
    const data = await getCategories()
    // Normaliza dados se necessário
    categories.value = Array.isArray(data) ? data : (data.items || [])
  } catch (error) {
    showError('Erro', 'Não foi possível carregar as categorias.')
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.description = ''
  showModal.value = true
}

function openEditModal(category) {
  isEditing.value = true
  editingId.value = category.id
  form.name = category.name
  form.description = category.description
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleSubmit() {
  if (!form.name) return

  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await updateCategory(editingId.value, { ...form, id: editingId.value })
      showSuccess('Sucesso', 'Categoria atualizada com sucesso!')
    } else {
      await createCategory(form)
      showSuccess('Sucesso', 'Categoria criada com sucesso!')
    }
    await fetchCategories()
    closeModal()
  } catch (error) {
    showError('Erro', 'Ocorreu um erro ao salvar a categoria.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(category) {
  const result = await showConfirm(
    'Excluir Categoria',
    `Tem certeza que deseja excluir a categoria "${category.name}"?`,
    'Sim, excluir',
    'Cancelar'
  )

  if (result.isConfirmed) {
    try {
      await deleteCategory(category.id)
      showSuccess('Sucesso', 'Categoria excluída com sucesso!')
      await fetchCategories()
    } catch (error) {
      showError('Erro', 'Não foi possível excluir a categoria.')
    }
  }
}

onMounted(fetchCategories)
</script>
