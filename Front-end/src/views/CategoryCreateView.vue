<template>
  <div class="mt-20 mx-auto max-w-lg bg-white p-8 rounded-xl shadow">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Cadastrar Categoria</h2>

    <form @submit.prevent="criar" class="flex flex-col gap-5">

      <!-- Nome -->
      <div class="flex flex-col gap-1">
        <label class="text-gray-700 font-medium">Nome da Categoria</label>
        <input
          type="text"
          v-model="store.name"
          placeholder="Digite o nome..."
          class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Descrição -->
      <div class="flex flex-col gap-1">
        <label class="text-gray-700 font-medium">Descrição</label>
        <input
          type="text"
          v-model="store.description"
          placeholder="Digite a descrição..."
          class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Botão -->
      <button
        type="submit"
        class="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        Cadastrar
      </button>

    </form>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useCategorysStore } from '@/stores/CategoyStore'


const categoryName = ref('')
const categoryDescription = ref('')
const store = useCategorysStore()

const name = ref('')

const criar = async () => {
store.createCategory()
}


</script>