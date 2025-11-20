<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold mb-6 text-gray-900">Categorias</h2>

    <div
      v-if="store.items.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="category in store.items"
        :key="category.id"
        class="bg-white p-5 rounded-xl border border-gray-200 shadow hover:shadow-xl transition cursor-pointer"
      >
        <h3 class="text-xl font-bold text-gray-800 mb-1">
          {{ category.name }}
        </h3>

        <p class="text-gray-500 text-sm mb-3">
          {{ category.description }}
        </p>

        <div class="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-4">
          <span class="px-2 py-1 bg-indigo-100 rounded-lg">
            {{ category.products?.length || 0 }} produtos
          </span>
        </div>

        <div v-if="category.products?.length" class="space-y-2">
          <p class="text-gray-700 font-medium">Produtos:</p>

          <ul class="max-h-32 overflow-y-auto pr-2 space-y-1">
            <li
              v-for="product in category.products.slice(0, 5)"
              :key="product.id"
              class="text-sm text-gray-600 flex items-center gap-2"
            >
              <span class="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
              {{ product.name }} — R$ {{ product.price }}
            </li>
          </ul>

          <p
            v-if="category.products.length > 5"
            class="text-xs text-gray-400 mt-1"
          >
            + {{ category.products.length - 5 }} outros produtos...
          </p>
        </div>

        <p
          v-else
          class="text-sm text-gray-400 italic"
        >
          Nenhum produto cadastrado.
        </p>
      </div>
    </div>

    <!-- SEM CATEGORIAS -->
    <div v-else class="text-center py-10 text-gray-500">
      Nenhuma categoria encontrada.
    </div>
  </div>
</template>

<script setup>
import { useCategorysStore } from '@/stores/CategoyStore'
import { onMounted } from 'vue'

const store = useCategorysStore()

onMounted(store.fetchCategories)
</script>
