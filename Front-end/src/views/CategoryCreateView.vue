<template>
  <div class="mt-20 mx-auto max-w-lg">

    <div class="bg-white p-8 rounded-xl shadow">

      <h2 class="text-3xl font-bold mb-10 text-gray-900 text-center">
        Cadastrar Categoria
      </h2>

      <form @submit.prevent="criar" class="space-y-8">

        <!-- Nome -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Nome da Categoria
          </label>
          <input
            type="text"
            v-model="store.name"
            placeholder="Ex: Roupas, Calçados..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-gray-400 focus:border-gray-400
                   transition-all duration-200"
          />
        </div>

        <!-- Descrição -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Descrição
          </label>
          <textarea
            v-model="store.description"
            rows="3"
            placeholder="Descrição breve da categoria..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-gray-400 focus:border-gray-400
                   transition-all duration-200 resize-none"
          ></textarea>
        </div>

        <!-- Botão -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-gray-800 text-white py-4 px-6 rounded-lg
                   font-bold text-lg hover:bg-gray-900
                   focus:ring-4 focus:ring-gray-300 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-lg hover:shadow-xl
                   transform hover:-translate-y-0.5"
          >
            Cadastrar
          </button>
        </div>

      </form>

    </div>

  </div>
</template>



<script setup>
import { useCategorysStore } from '@/stores/CategoyStore'
import { useAlerts } from '@/composables/useAlerts'

const store = useCategorysStore()

const { showSuccess, showError, showLoading, closeLoading } = useAlerts()

const criar = async () => {
 try {  
    showLoading('Cadastrando categoria...')
      
    await store.createCategory()

    closeLoading()
      
    await showSuccess('Categoria criada!', 'A categoria foi cadastrada com sucesso.')
  }catch (err) {
    closeLoading()
    await showError('Erro', 'Não foi possível criar a categoria.')
    console.error(err)
  }

}
</script>