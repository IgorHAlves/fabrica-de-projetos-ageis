import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/Services/Axios'
import { useAlerts } from '../composables/useAlerts'

export const useProductsStore = defineStore('products', () => {
    const products = ref([])
    const isLoading = ref(false)
    const errorMessage = ref('')
    const { showError, showSuccessToast, showConfirm } = useAlerts()

    const totalProducts = computed(() => products.value.length)

    function resetError() {
        errorMessage.value = ''
    }

    async function fetchAll() {
        isLoading.value = true
        resetError()
        try {
            const response = await api.get('Product')
            products.value = response.data.items || []
        } catch (e) {
            errorMessage.value = 'Falha ao carregar produtos.'
            // Loga erro apenas em desenvolvimento
            if (import.meta.env.DEV) {
                console.error('Erro ao buscar produtos:', e)
            }
            showError('Erro ao carregar produtos', 'Não foi possível carregar a lista de produtos.')
        } finally {
            isLoading.value = false
        }
    }

    async function create(productInput) {
        isLoading.value = true
        resetError()
        try {
            if (import.meta.env.DEV) {
                console.log('Enviando para API:', JSON.stringify(productInput, null, 2))
            }
            const response = await api.post('Product', productInput)
            const newProduct = response.data
            if (import.meta.env.DEV) {
                console.log('Resposta do backend:', newProduct)
            }
            products.value = [newProduct, ...products.value]
            return newProduct
        } catch (e) {
            errorMessage.value = 'Falha ao cadastrar produto.'
            // Loga erro detalhado apenas em desenvolvimento
            if (import.meta.env.DEV) {
                const errorData = e.response?.data

                // Função para extrair innerException recursivamente
                function extractInnerException(obj, depth = 0) {
                    if (depth > 5 || !obj || typeof obj !== 'object') return ''

                    const keys = ['innerException', 'InnerException', 'inner', 'error', 'detail', 'exception']
                    for (const key of keys) {
                        if (obj[key]) {
                            if (typeof obj[key] === 'string') return obj[key]
                            if (typeof obj[key] === 'object') {
                                const nested = extractInnerException(obj[key], depth + 1)
                                if (nested) return nested
                            }
                        }
                    }
                    return ''
                }

                const innerException = extractInnerException(errorData) ||
                    errorData?.innerException ||
                    errorData?.InnerException ||
                    errorData?.error?.innerException ||
                    errorData?.errors ||
                    errorData?.detail ||
                    ''

                console.error('=== ERRO NA STORE - CRIAÇÃO DE PRODUTO ===')
                console.error('Mensagem:', e.message)
                console.error('Status:', e.response?.status, e.response?.statusText)
                console.error('Response Data:', errorData)
                if (innerException) {
                    console.error('=== INNER EXCEPTION ===')
                    console.error(innerException)
                }
                console.error('Dados enviados:', productInput)
                console.error('==========================================')
            }
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
            // Loga erro apenas em desenvolvimento
            if (import.meta.env.DEV) {
                console.error('Erro ao deletar produto:', e)
            }
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
        fetchAll,
        create,
        deleteProduct
    }
})


