import api from '@/Services/Axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAlerts } from '../composables/useAlerts'

export const useProductsStore = defineStore('products', () => {
    const products = ref([])
    const isLoading = ref(false)
    const errorMessage = ref('')

    // State para busca e paginação
    const searchName = ref('')
    const pageNumber = ref(1)
    const pageSize = ref(12)
    const totalPages = ref(0)
    const totalItems = ref(0)

    const { showError, showSuccessToast, showConfirm } = useAlerts()

    const totalProducts = computed(() => products.value.length)

    function resetError() {
        errorMessage.value = ''
    }

    function setSearchName(name) {
        searchName.value = name
    }

    function setPage(page) {
        pageNumber.value = page
    }

    async function fetchProducts() {
        isLoading.value = true
        resetError()
        try {
            // Constrói a query string
            const params = {
                pageNumber: pageNumber.value,
                pageSize: pageSize.value,
                t: new Date().getTime()
            }

            if (searchName.value) {
                params.name = searchName.value
            }



            const response = await api.get('Product', { params })

            // A API retorna { items: [], totalPages: 0, totalItems: 0, ... }
            products.value = response.data.items || []
            totalPages.value = response.data.totalPages || 0
            totalItems.value = response.data.totalItems || 0

        } catch (e) {
            errorMessage.value = 'Falha ao carregar produtos.'
            console.error('Erro ao buscar produtos:', e)
            showError('Erro ao carregar produtos', 'Não foi possível carregar a lista de produtos.')
        } finally {
            isLoading.value = false
        }
    }

    async function fetchAll() {
        // Mantido para compatibilidade, mas idealmente deve usar fetchProducts
        return fetchProducts()
    }

    async function create(productInput) {
        isLoading.value = true
        resetError()
        try {
            const response = await api.post('Product', productInput)
            const newProduct = response.data
            // Adiciona no início da lista se estiver na primeira página
            if (pageNumber.value === 1) {
                products.value = [newProduct, ...products.value]
            }
            return newProduct
        } catch (e) {
            errorMessage.value = 'Falha ao cadastrar produto.'
            console.error('Erro detalhado ao criar produto:', e)
            throw e
        } finally {
            isLoading.value = false
        }
    }

    async function update(id, productInput) {
        isLoading.value = true
        resetError()
        try {
            const response = await api.put(`Product/${id}`, productInput)

            // Atualiza a lista local
            const index = products.value.findIndex(p => p.id === id)
            if (index !== -1) {
                products.value[index] = { ...products.value[index], ...productInput }
            }

            return response.data
        } catch (e) {
            errorMessage.value = 'Falha ao atualizar produto.'
            console.error('Erro ao atualizar produto:', e)
            throw e
        } finally {
            isLoading.value = false
        }
    }

    async function deleteProduct(productId) {
        const result = await showConfirm(
            'Deletar Produto',
            'Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.',
            'Sim, deletar',
            'Cancelar'
        )

        if (!result.isConfirmed) {
            return false
        }

        isLoading.value = true
        resetError()
        try {
            await api.delete(`Product/${productId}`)
            products.value = products.value.filter(p => p.id !== productId)
            showSuccessToast('Produto deletado com sucesso!')
            return true
        } catch (e) {
            errorMessage.value = 'Falha ao deletar produto.'
            console.error('Erro ao deletar produto:', e)
            showError('Erro ao deletar produto', 'Não foi possível deletar o produto.')
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        products,
        isLoading,
        errorMessage,
        totalProducts,
        searchName,
        pageNumber,
        pageSize,
        totalPages,
        totalItems,
        setSearchName,
        setPage,
        fetchProducts,
        fetchAll,
        create,
        update,
        deleteProduct
    }
})


