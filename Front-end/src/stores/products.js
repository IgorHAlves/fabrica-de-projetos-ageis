import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/Services/Axios'

export const useProductsStore = defineStore('products', () => {
    const products = ref([])
    const isLoading = ref(false)
    const errorMessage = ref('')

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
            console.error('Erro ao buscar produtos:', e)
        } finally {
            isLoading.value = false
        }
    }

    async function create(productInput) {
        isLoading.value = true
        resetError()
        try {
            console.log('Enviando produto para API:', productInput)
            console.log('URL da requisição:', api.defaults.baseURL + 'Product')

            const response = await api.post('Product', productInput)
            console.log('Resposta da API:', response)
            console.log('Produto criado:', response.data)

            const newProduct = response.data
            products.value = [newProduct, ...products.value]
            return newProduct
        } catch (e) {
            errorMessage.value = 'Falha ao cadastrar produto.'
            console.error('Erro detalhado ao criar produto:', e)
            console.error('Status do erro:', e.response?.status)
            console.error('Dados do erro:', e.response?.data)
            console.error('URL da requisição:', e.config?.url)
            throw e
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
        create
    }
})


