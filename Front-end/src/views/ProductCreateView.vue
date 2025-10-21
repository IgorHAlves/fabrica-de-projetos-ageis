<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Cadastrar Produto</h1>
          <p class="text-gray-600">Preencha os dados do novo produto</p>
        </div>
        
        <form @submit.prevent="onSubmit" class="space-y-8">
          <!-- Nome do Produto -->
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-3">Nome do Produto</label>
            <input 
              id="name" 
              v-model.trim="form.name" 
              type="text" 
              placeholder="Ex: Camiseta Polo Masculina" 
              required 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
            />
            <p v-if="errors.name" class="mt-2 text-sm text-red-600 font-medium">{{ errors.name }}</p>
          </div>

          <!-- Preço e Estoque -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Preço -->
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <label for="price" class="block text-sm font-semibold text-gray-700 mb-3">Preço (R$)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                <input 
                  id="price" 
                  v-model.number="form.price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="99,90" 
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
                />
              </div>
              <p v-if="errors.price" class="mt-2 text-sm text-red-600 font-medium">{{ errors.price }}</p>
            </div>

            <!-- Estoque -->
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <label for="stock" class="block text-sm font-semibold text-gray-700 mb-3">Quantidade em Estoque</label>
              <input 
                id="stock" 
                v-model.number="form.stock" 
                type="number" 
                min="0" 
                placeholder="100" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
              />
              <p v-if="errors.stock" class="mt-2 text-sm text-red-600 font-medium">{{ errors.stock }}</p>
            </div>
          </div>

          <!-- Descrição -->
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label for="description" class="block text-sm font-semibold text-gray-700 mb-3">Descrição</label>
            <textarea 
              id="description" 
              v-model.trim="form.description" 
              rows="4"
              placeholder="Descreva as características e detalhes do produto..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <!-- Categoria -->
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label for="category" class="block text-sm font-semibold text-gray-700 mb-3">Categoria</label>
            <select 
              id="category" 
              v-model="form.category"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 appearance-none bg-white"
            >
              <option disabled value="">Selecione uma categoria</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category" class="mt-2 text-sm text-red-600 font-medium">{{ errors.category }}</p>
            <p v-if="categoriesLoading" class="mt-2 text-sm text-gray-600 font-medium">Carregando categorias...</p>
            <p v-if="categoriesError" class="mt-2 text-sm text-red-600 font-medium">{{ categoriesError }}</p>
          </div>


          <!-- Upload de Imagem (Opcional) -->
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label for="imageFile" class="block text-sm font-semibold text-gray-700 mb-3">Upload da Imagem</label>
            
            <!-- File Input -->
            <div class="mb-4">
              <input 
                id="imageFile" 
                type="file" 
                accept="image/*" 
                @change="onFileChange" 
                class="w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 cursor-pointer hover:border-gray-400"
              />
            </div>
            
            <!-- Progress Bar -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gray-600 h-2 rounded-full transition-all duration-300" :style="{width: uploadProgress + '%'}"></div>
              </div>
              <p class="mt-2 text-sm text-gray-600 font-medium">Enviando: {{ uploadProgress }}%</p>
            </div>
            
            <!-- Image Preview -->
            <div v-if="form.imageUrl" class="mt-4">
              <p class="text-sm font-medium text-gray-700 mb-3">Prévia da imagem:</p>
              <div class="flex gap-4">
                <img :src="form.imageUrl" alt="Prévia" class="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm" />
                <div class="flex-1 flex items-center">
                  <span class="text-sm text-gray-600">Imagem carregada com sucesso!</span>
                </div>
              </div>
            </div>
            
            <!-- Error Messages -->
            <p v-if="errors.imageUrl" class="mt-2 text-sm text-red-600 font-medium">{{ errors.imageUrl }}</p>
            <p class="mt-2 text-sm text-gray-500">Formatos aceitos: JPG, PNG, GIF. Máximo 10MB.</p>
          </div>

          <!-- Botão de Submit -->
          <div class="pt-6">
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
              <span v-else>Cadastrar</span>
            </button>
          </div>

          <!-- Mensagens -->
          <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-green-800 font-medium">{{ successMessage }}</p>
            </div>
          </div>
          
          <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-red-800 font-medium">{{ errorMessage }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { uploadImageToCloudinary } from '@/services/cloudinary'
import { useProductsStore } from '@/stores/products'
import { getCategories } from '@/Services/CategoriesService'
import { reactive, ref, onMounted } from 'vue'

const store = useProductsStore()
const isLoading = store.isLoading
const errorMessage = store.errorMessage

const form = reactive({
  name: '',
  price: null,
  stock: null,
  description: '',
  category: '',
  imageUrl: ''
})

const errors = reactive({})
const successMessage = ref('')
const uploadProgress = ref(0)

// Estados para categorias
const categories = ref([])
const categoriesLoading = ref(false)
const categoriesError = ref('')

// Função para carregar categorias da API
async function loadCategories() {
  categoriesLoading.value = true
  categoriesError.value = ''
  
  try {
    const data = await getCategories()
    categories.value = data || []
    console.log('Categorias carregadas com sucesso:', categories.value)
  } catch (error) {
    categoriesError.value = 'Erro ao carregar categorias'
    console.error('Erro ao carregar categorias:', error)
  } finally {
    categoriesLoading.value = false
  }
}

function validate() {
  errors.name = form.name ? '' : 'Nome é obrigatório.'
  errors.price = form.price !== null && form.price >= 0 ? '' : 'Preço inválido.'
  errors.stock = form.stock !== null && form.stock >= 0 ? '' : 'Estoque inválido.'
  errors.category = form.category ? '' : 'Categoria é obrigatória.'
  // Removido validação obrigatória da imagem para permitir cadastro sem imagem
  errors.imageUrl = ''
  return !errors.name && !errors.price && !errors.stock && !errors.category
}

async function onSubmit() {
  successMessage.value = ''
  if (!validate()) return
  
  try {
    const input = { 
      name: form.name,
      description: form.description || null,
      price: form.price || 0,
      imageUrl: form.imageUrl || null,
      stock: form.stock || 0,
      idPai: null, // null em vez de string vazia para evitar erro de GUID
      idCategory: form.category // ID da categoria selecionada
    }
    
    console.log('Dados do produto a ser criado:', input)
    await store.create(input)
    successMessage.value = 'Produto cadastrado com sucesso!'
    
    // Limpar o formulário após sucesso
    form.name = ''
    form.price = null
    form.stock = null
    form.description = ''
    form.category = ''
    form.imageUrl = ''
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    // O erro já é tratado pelo store
  }
}

async function onFileChange(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  
  uploadProgress.value = 0
  try {
    // Verificar se Cloudinary está configurado
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    
    if (!cloudName || !uploadPreset) {
      console.warn('Cloudinary não configurado. Imagem será ignorada.')
      form.imageUrl = '' // Limpar URL da imagem
      return
    }
    
    const res = await uploadImageToCloudinary(file, p => uploadProgress.value = p)
    form.imageUrl = res.secure_url
    console.log('Imagem enviada com sucesso:', res.secure_url)
  } catch (error) {
    console.error('Erro ao enviar imagem:', error)
    errors.imageUrl = 'Falha ao enviar imagem. Produto será cadastrado sem imagem.'
    form.imageUrl = '' // Limpar URL da imagem em caso de erro
  }
}

// Carregar categorias quando o componente for montado
onMounted(() => {
  loadCategories()
})
</script>

