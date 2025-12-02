import { getProductById } from '@/Services/ProductsService'
import { useProductsStore } from '@/stores/products'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAlerts } from './useAlerts'

export function useProductForm(productIdRef, variationSourceIdRef) {
    const store = useProductsStore()
    const router = useRouter()
    const { showSuccess, showError, showLoading, closeLoading } = useAlerts()

    const form = reactive({
        name: '',
        price: null,
        stock: null,
        description: '',
        category: '',
        imageUrl: '',
        idPai: null
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
    const isEditMode = computed(() => !!productIdRef?.value)

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
        form.idPai = null

        // Limpar erros e touched
        Object.keys(errors).forEach(key => {
            errors[key] = ''
        })
        Object.keys(touched).forEach(key => {
            touched[key] = false
        })
    }

    function fillForm(product, isVariation) {
        form.price = product.price
        form.stock = product.stock || product.stockQuantity
        form.description = product.description
        form.category = product.category?.id || product.idCategory || product.category

        if (isVariation) {
            form.idPai = product.id
            form.name = ''
            form.imageUrl = ''
        } else {
            form.name = product.name
            form.imageUrl = product.imageUrl
            form.idPai = product.idPai
        }
    }

    async function loadProductData(id, isVariation = false) {
        if (!id) return

        // Verifica se os dados foram passados via router state
        const stateProduct = history.state?.productData

        if (stateProduct && String(stateProduct.id) === String(id)) {
            fillForm(stateProduct, isVariation)
            return
        }

        isLoading.value = true
        try {
            const product = await getProductById(id)
            if (product) {
                fillForm(product, isVariation)
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error)
            showError('Erro', 'Não foi possível carregar os dados do produto.')
        } finally {
            isLoading.value = false
        }
    }

    async function submitForm() {
        if (!validate()) return false

        isLoading.value = true
        showLoading(isEditMode.value ? 'Atualizando produto...' : 'Cadastrando produto...')

        try {
            const input = {
                name: form.name,
                description: form.description || null,
                price: form.price || 0,
                imageUrl: form.imageUrl || null,
                stock: form.stock || 0,
                idPai: form.idPai || null,
                idCategory: form.category
            }

            if (isEditMode.value) {
                await store.update(productIdRef.value, input)
                await showSuccess('Produto atualizado!', 'O produto foi atualizado com sucesso.')
            } else {
                await store.create(input)
                await showSuccess('Produto cadastrado!', 'O produto foi cadastrado com sucesso.')
            }

            closeLoading()

            if (!isEditMode.value) {
                resetForm()
            }

            router.push({ name: 'AdminProductsDashboard' })
            return true
        } catch (error) {
            console.error('Erro ao salvar produto:', error)
            closeLoading()
            await showError('Erro ao salvar', 'Não foi possível salvar o produto. Tente novamente.')
            return false
        } finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
        if (productIdRef?.value) {
            loadProductData(productIdRef.value)
        } else if (variationSourceIdRef?.value) {
            loadProductData(variationSourceIdRef.value, true)
        }
    })

    // Watchers para reagir a mudanças nos props (caso o componente não seja desmontado)
    watch(() => productIdRef?.value, (newId) => {
        if (newId) {
            loadProductData(newId)
        } else {
            resetForm()
        }
    })

    watch(() => variationSourceIdRef?.value, (newId) => {
        if (newId && !productIdRef?.value) {
            loadProductData(newId, true)
        }
    })

    return {
        form,
        errors,
        touched,
        isLoading,
        isEditMode,
        validate,
        validateField,
        markAsTouched,
        resetForm,
        submitForm
    }
}
