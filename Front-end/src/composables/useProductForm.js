import { reactive, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAlerts } from './useAlerts'

export function useProductForm() {
    const store = useProductsStore()
    const { showSuccess, showError, showLoading, closeLoading } = useAlerts()

    const form = reactive({
        name: '',
        price: null,
        stock: null,
        description: '',
        category: '',
        imageUrl: ''
    })

    const errors = reactive({})
    const isLoading = ref(false)

    function validate() {
        errors.name = form.name ? '' : 'Nome é obrigatório.'
        errors.price = form.price !== null && form.price >= 0 ? '' : 'Preço inválido.'
        errors.stock = form.stock !== null && form.stock >= 0 ? '' : 'Estoque inválido.'
        errors.category = form.category ? '' : 'Categoria é obrigatória.'
        errors.imageUrl = ''
        return !errors.name && !errors.price && !errors.stock && !errors.category
    }

    function resetForm() {
        form.name = ''
        form.price = null
        form.stock = null
        form.description = ''
        form.category = ''
        form.imageUrl = ''

        // Limpar erros
        Object.keys(errors).forEach(key => {
            errors[key] = ''
        })
    }

    async function submitForm() {
        if (!validate()) return false

        isLoading.value = true
        showLoading('Cadastrando produto...')

        try {
            const input = {
                name: form.name,
                description: form.description || null,
                price: form.price || 0,
                imageUrl: form.imageUrl || null,
                stock: form.stock || 0,
                idPai: null,
                idCategory: form.category
            }

            console.log('Dados do produto a ser criado:', input)
            await store.create(input)

            closeLoading()
            await showSuccess('Produto cadastrado!', 'O produto foi cadastrado com sucesso.')

            resetForm()
            return true
        } catch (error) {
            console.error('Erro ao criar produto:', error)
            closeLoading()
            await showError('Erro ao cadastrar', 'Não foi possível cadastrar o produto. Tente novamente.')
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        form,
        errors,
        isLoading,
        validate,
        resetForm,
        submitForm
    }
}
