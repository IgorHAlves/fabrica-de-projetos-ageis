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
            <i class="fa-solid fa-box text-blue-600"></i>
            Dashboard de Produtos
          </h1>
          <p class="text-gray-600">Gerencie seu catálogo, estoque e variações</p>
        </div>
        <button @click="goToCreate" class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md flex items-center gap-2">
          <i class="fa-solid fa-plus"></i>
          Cadastrar Produto
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total de Produtos" :value="stats.totalProducts" icon="fa-solid fa-box" />
        <StatsCard title="Variações" :value="stats.totalVariations" icon="fa-solid fa-layer-group" />
        <StatsCard title="Valor em Estoque" :value="formattedStockValue" icon="fa-solid fa-dollar-sign" />
      </div>

      <!-- Product List -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-800">Produtos Cadastrados</h2>
        </div>
        
        <!-- Loading State -->
        <!-- Loading State -->
        <TableSkeleton v-if="isLoading" :columns="5" :rows="8" />

        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Variações</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estoque</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ product.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ product.variations?.length || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{'text-red-600 font-bold': product.stockQuantity < 10, 'text-green-600': product.stockQuantity >= 10}">
                    {{ product.stockQuantity }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{{ formatCurrency(product.price) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center space-x-4">
                  <button @click="editProduct(product.id)" class="text-blue-600 hover:text-blue-800 transition" title="Editar">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-800 transition" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                  <i class="fa-solid fa-box-open text-4xl mb-3 block text-gray-300"></i>
                  Nenhum produto cadastrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import StatsCard from '../components/StatsCard.vue'
import TableSkeleton from '../components/TableSkeleton.vue'
import { useAlerts } from '../composables/useAlerts'
import { deleteProduct as apiDeleteProduct, getProducts } from '../Services/ProductsService'

const router = useRouter()
const { showSuccess, showError, showConfirm } = useAlerts()
const products = ref([])
const stats = ref({ totalProducts: 0, totalVariations: 0, totalStockValue: 0 })
const isLoading = ref(true)

function fetchData() {
  isLoading.value = true
  getProducts(1, 100)
    .then(data => {
      let items = data.items || []
      const total = data.totalCount || items.length
      
      // Vincula as variações manualmente
      items = items.map(p => {
        const children = items.filter(child => child.idPai === p.id)
        return {
          ...p,
          variations: children
        }
      })

      products.value = items
      computeStats(total)
    })
    .catch(err => console.error('Erro ao buscar produtos', err))
    .finally(() => {
      isLoading.value = false
    })
}

function computeStats(totalCount) {
  const total = totalCount
  let variations = 0
  let stockValue = 0
  
  products.value.forEach(p => {
    variations += p.variations?.length || 0
    stockValue += (p.price || 0)
  })
  
  stats.value = { totalProducts: total, totalVariations: variations, totalStockValue: stockValue }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const formattedStockValue = computed(() => formatCurrency(stats.value.totalStockValue))

function goToCreate() {
  router.push({ path: '/admin/products/create' })
}

function editProduct(id) {
  router.push({ path: '/admin/products/create', query: { id } })
}

async function deleteProduct(id) {
  const result = await showConfirm(
    'Excluir Produto',
    'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
    'Sim, excluir',
    'Cancelar'
  )

  if (result.isConfirmed) {
    try {
      await apiDeleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
      computeStats(stats.value.totalProducts - 1)
      showSuccess('Sucesso', 'Produto excluído com sucesso!')
    } catch (err) {
      console.error('Erro ao excluir', err)
      showError('Erro', 'Não foi possível excluir o produto.')
    }
  }
}

onMounted(fetchData)
</script>

<style scoped>
/* optional styling */
</style>
