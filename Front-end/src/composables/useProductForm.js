import { useProductsStore } from '@/stores/products'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlerts } from './useAlerts'

export function useProductForm() {
    const store = useProductsStore()
    const router = useRouter()
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

    const touched = reactive({
        name: false,
        price: false,
        stock: false,
        category: false,
        imageUrl: false
    })

    const isLoading = ref(false)

    function markAsTouched(fieldName) {
        touched[fieldName] = true
        validateField(fieldName)
    }

    function validateField(fieldName) {
        switch (fieldName) {
            case 'name':
                errors.name = form.name ? '' : 'Nome é obrigatório.'
                break
            case 'price':
                errors.price = form.price !== null && form.price >= 0 ? '' : 'Preço inválido.'
                break
            case 'stock':
                errors.stock = form.stock !== null && form.stock >= 0 ? '' : 'Estoque inválido.'
                break
            case 'category':
                errors.category = form.category ? '' : 'Categoria é obrigatória.'
                break
        }
    }

    function validate() {
        // Marca todos como tocados
        Object.keys(touched).forEach(key => {
            touched[key] = true
        })

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

        // Limpar erros e touched
        Object.keys(errors).forEach(key => {
            errors[key] = ''
        })
        Object.keys(touched).forEach(key => {
            touched[key] = false
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


            await store.create(input)

            closeLoading()
            await showSuccess('Produto cadastrado!', 'O produto foi cadastrado com sucesso.')

            resetForm()
            router.push({ name: 'AdminProductsDashboard' })
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
        touched,
        isLoading,
        validate,
        validateField,
        markAsTouched,
        resetForm,
        submitForm
    }
}
