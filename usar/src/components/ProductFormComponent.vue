<template>
    <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Nome do Produto -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100">
            <label for="name" class="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <i class="fa-solid fa-tag mr-2 text-blue-600"></i>
                Nome do Produto <span class="text-red-500 ml-1">*</span>
            </label>
            <input id="name" v-model.trim="form.name" type="text" placeholder="Ex: Camiseta Polo Masculina" required
                @blur="markAsTouched('name')" :class="[
                    'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 bg-white text-gray-900',
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : touched.name ? 'border-green-300 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                ]" />
            <p v-if="errors.name" class="mt-2 text-sm text-red-600 font-medium flex items-center">
                <i class="fa-solid fa-exclamation-circle mr-2"></i>
                {{ errors.name }}
            </p>
        </div>

        <!-- Preço e Estoque -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Preço -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-100">
                <label for="price" class="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <i class="fa-solid fa-dollar-sign mr-2 text-green-600"></i>
                    Preço (R$) <span class="text-red-500 ml-1">*</span>
                </label>
                <div class="relative">
                    <span
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold text-lg">R$</span>
                    <input id="price" v-model.number="form.price" type="number" step="0.01" min="0" placeholder="99,90"
                        @blur="markAsTouched('price')" :class="[
                            'w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 bg-white text-gray-900',
                            errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : touched.price ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                        ]" />
                </div>
                <p v-if="errors.price" class="mt-2 text-sm text-red-600 font-medium flex items-center">
                    <i class="fa-solid fa-exclamation-circle mr-2"></i>
                    {{ errors.price }}
                </p>
            </div>

            <!-- Estoque -->
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-100">
                <label for="stock" class="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <i class="fa-solid fa-box mr-2 text-purple-600"></i>
                    Quantidade em Estoque <span class="text-red-500 ml-1">*</span>
                </label>
                <input id="stock" v-model.number="form.stock" type="number" min="0" placeholder="100" required
                    @blur="markAsTouched('stock')" :class="[
                        'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 bg-white text-gray-900',
                        errors.stock ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : touched.stock ? 'border-green-300 focus:border-purple-500 focus:ring-purple-500' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-500'
                    ]" />
                <p v-if="errors.stock" class="mt-2 text-sm text-red-600 font-medium flex items-center">
                    <i class="fa-solid fa-exclamation-circle mr-2"></i>
                    {{ errors.stock }}
                </p>
            </div>
        </div>

        <!-- Descrição -->
        <div class="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-100">
            <label for="description" class="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <i class="fa-solid fa-align-left mr-2 text-amber-600"></i>
                Descrição do Produto
            </label>
            <textarea id="description" v-model.trim="form.description" rows="5"
                placeholder="Descreva as características e detalhes do produto..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none bg-white text-gray-900"></textarea>
        </div>

        <!-- Seleção de Produto Pai (Variação) -->
        <ProductParentSelectComponent v-model="form.idPai" />

        <!-- Categoria -->
        <ProductCategorySelectComponent v-model="form.category" :error="errors.category" :disabled="!!form.idPai"
            @blur="markAsTouched('category')" />

        <!-- Upload de Imagem -->
        <ProductImageUploadComponent v-model="form.imageUrl" :error="errors.imageUrl"
            @upload-progress="onUploadProgress" />

        <!-- Botão de Submit -->
        <div class="pt-6">
            <button type="submit" :disabled="isLoading"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                <span v-if="isLoading" class="flex items-center justify-center">
                    <i class="fa-solid fa-spinner fa-spin mr-3"></i>
                    Salvando produto...
                </span>
                <span v-else class="flex items-center justify-center">
                    <i class="fa-solid fa-check-circle mr-2"></i>
                    Cadastrar Produto
                </span>
            </button>

            <!-- Link para voltar -->
            <router-link to="/produtos"
                class="mt-4 block text-center text-gray-600 hover:text-gray-900 font-semibold transition-colors">
                <i class="fa-solid fa-arrow-left mr-2"></i>
                Voltar para lista de produtos
            </router-link>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import ProductCategorySelectComponent from './ProductCategorySelectComponent.vue'
import ProductImageUploadComponent from './ProductImageUploadComponent.vue'
import ProductParentSelectComponent from './ProductParentSelectComponent.vue'
import { useProductForm } from '../composables/useProductForm'

const { form, errors, touched, isLoading, validate, markAsTouched, submitForm } = useProductForm()

const uploadProgress = ref(0)

function onUploadProgress(progress) {
    uploadProgress.value = progress
}

async function onSubmit() {
    await submitForm()
}
</script>
