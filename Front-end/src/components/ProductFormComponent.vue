<template>
    <form @submit.prevent="onSubmit" class="space-y-8">
        <!-- Nome do Produto -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-3">Nome do Produto</label>
            <input id="name" v-model.trim="form.name" type="text" placeholder="Ex: Camiseta Polo Masculina" required
                @blur="markAsTouched('name')" :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200',
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : touched.name ? 'border-green-300 focus:border-gray-500 focus:ring-gray-400' : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400'
                ]" />
            <p v-if="errors.name" class="mt-2 text-sm text-red-600 font-medium">{{ errors.name }}</p>
        </div>

        <!-- Preço e Estoque -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Preço -->
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <label for="price" class="block text-sm font-semibold text-gray-700 mb-3">Preço (R$)</label>
                <div class="relative">
                    <span
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                    <input id="price" v-model.number="form.price" type="number" step="0.01" min="0" placeholder="99,90"
                        @blur="markAsTouched('price')" :class="[
                            'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200',
                            errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : touched.price ? 'border-green-300 focus:border-gray-500 focus:ring-gray-400' : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400'
                        ]" />
                </div>
                <p v-if="errors.price" class="mt-2 text-sm text-red-600 font-medium">{{ errors.price }}</p>
            </div>

            <!-- Estoque -->
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <label for="stock" class="block text-sm font-semibold text-gray-700 mb-3">Quantidade em Estoque</label>
                <input id="stock" v-model.number="form.stock" type="number" min="0" placeholder="100" required
                    @blur="markAsTouched('stock')" :class="[
                        'w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200',
                        errors.stock ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : touched.stock ? 'border-green-300 focus:border-gray-500 focus:ring-gray-400' : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400'
                    ]" />
                <p v-if="errors.stock" class="mt-2 text-sm text-red-600 font-medium">{{ errors.stock }}</p>
            </div>
        </div>

        <!-- Descrição -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label for="description" class="block text-sm font-semibold text-gray-700 mb-3">Descrição</label>
            <textarea id="description" v-model.trim="form.description" rows="4"
                placeholder="Descreva as características e detalhes do produto..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 resize-none"></textarea>
        </div>

        <!-- Seleção de Produto Pai (Variação) -->
        <ProductParentSelectComponent v-model="form.idPai" @parent-selected="onParentSelected" />

        <!-- Categoria -->
        <ProductCategorySelectComponent v-model="form.category" :error="errors.category" :disabled="!!form.idPai"
            @blur="markAsTouched('category')" />

        <!-- Upload de Imagem -->
        <ProductImageUploadComponent v-model="form.imageUrl" :error="errors.imageUrl"
            @upload-progress="onUploadProgress" />

        <!-- Botão de Submit -->
        <div class="pt-6">
            <button type="submit" :disabled="isLoading"
                class="w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span v-if="isLoading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    Salvando...
                </span>
                <span v-else>{{ isEditMode ? 'Atualizar' : 'Cadastrar' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { useProductForm } from '../composables/useProductForm'
import ProductCategorySelectComponent from './ProductCategorySelectComponent.vue'
import ProductImageUploadComponent from './ProductImageUploadComponent.vue'
import ProductParentSelectComponent from './ProductParentSelectComponent.vue'

const props = defineProps({
  productId: {
    type: String,
    default: null
  },
  variationSourceId: {
    type: String,
    default: null
  }
})

const { form, errors, touched, isLoading, validate, markAsTouched, submitForm, isEditMode } = useProductForm(toRef(props, 'productId'), toRef(props, 'variationSourceId'))

const uploadProgress = ref(0)

function onUploadProgress(progress) {
  uploadProgress.value = progress
}

async function onSubmit() {
  await submitForm()
}

function onParentSelected(parent) {
  if (parent) {
    // Tenta obter o ID da categoria de várias formas possíveis
    const categoryId = parent.category?.id || parent.idCategory || parent.category
    
    if (categoryId) {
      form.category = categoryId
      // Valida o campo para remover o erro visual se houver
      markAsTouched('category')
    }
  }
}
</script>
