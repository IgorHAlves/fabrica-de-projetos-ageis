import { useProductsStore } from '@/stores/products'
import { reactive, ref, watch } from 'vue'
import { getProductById } from '../Services/ProductsService'
import { useAlerts } from './useAlerts'

export function useProductForm(productId = null) {
    const store = useProductsStore()
    const { showSuccess, showError, showLoading, closeLoading } = useAlerts()
    const isEditMode = ref(!!productId)
    const isLoadingProduct = ref(false)

    const form = reactive({
        name: '',
        price: null,
        stock: null,
        description: '',
        category: '',
        imageUrl: '',
        idPai: null // Produto pai (para variações)
    })

    // Watch para debug do idPai
    if (import.meta.env.DEV) {
        watch(() => form.idPai, (newValue) => {
            console.log('form.idPai mudou para:', newValue)
        })
    }

    const errors = reactive({})
    const touched = reactive({
        name: false,
        price: false,
        stock: false,
        category: false,
        imageUrl: false
    })
    const isLoading = ref(false)

    // Validação em tempo real para nome
    watch(() => form.name, (newValue) => {
        if (touched.name) {
            errors.name = newValue?.trim() ? '' : 'Nome é obrigatório.'
        }
    })

    // Validação em tempo real para preço
    watch(() => form.price, (newValue) => {
        if (touched.price) {
            errors.price = (newValue !== null && newValue >= 0) ? '' : 'Preço inválido. Deve ser um número maior ou igual a zero.'
        }
    })

    // Validação em tempo real para estoque
    watch(() => form.stock, (newValue) => {
        if (touched.stock) {
            errors.stock = (newValue !== null && newValue >= 0) ? '' : 'Estoque inválido. Deve ser um número maior ou igual a zero.'
        }
    })

    // Validação em tempo real para categoria
    watch(() => form.category, (newValue) => {
        // Se for variação, não valida categoria
        if (form.idPai) {
            errors.category = ''
            return
        }

        // Limpa erro se tiver valor válido (mesmo que não tenha sido tocado ainda)
        if (newValue && newValue !== '' && newValue !== 0 && newValue !== '0' && newValue !== null && newValue !== undefined) {
            errors.category = ''
        } else if (touched.category) {
            // Só mostra erro se o campo foi tocado
            errors.category = 'Categoria é obrigatória.'
        }
    })

    // Marca campo como "tocado" quando perde o foco
    function markAsTouched(fieldName) {
        touched[fieldName] = true
        validateField(fieldName)
    }

    // Valida um campo específico
    function validateField(fieldName) {
        switch (fieldName) {
            case 'name':
                errors.name = form.name?.trim() ? '' : 'Nome é obrigatório.'
                break
            case 'price':
                errors.price = (form.price !== null && form.price >= 0) ? '' : 'Preço inválido. Deve ser um número maior ou igual a zero.'
                break
            case 'stock':
                errors.stock = (form.stock !== null && form.stock >= 0) ? '' : 'Estoque inválido. Deve ser um número maior ou igual a zero.'
                break
            case 'category':
                // Se for variação, não valida categoria (será herdada do pai)
                if (form.idPai) {
                    errors.category = ''
                    break
                }

                // Valida se categoria foi selecionada (não vazia, não null, não undefined, não 0)
                const categoryValue = form.category
                const isValidCategory = categoryValue &&
                    categoryValue !== '' &&
                    categoryValue !== 0 &&
                    categoryValue !== '0' &&
                    categoryValue !== null &&
                    categoryValue !== undefined &&
                    (typeof categoryValue === 'number' ? categoryValue > 0 : String(categoryValue).trim().length > 0)
                errors.category = isValidCategory ? '' : 'Categoria é obrigatória.'
                break
        }
    }

    function validate() {
        // Marca todos como tocados para mostrar todos os erros
        Object.keys(touched).forEach(key => {
            touched[key] = true
        })

        validateField('name')
        validateField('price')
        validateField('stock')

        // Se for variação (tem idPai), não valida categoria (será herdada do pai)
        if (!form.idPai) {
            validateField('category')
        } else {
            errors.category = '' // Limpa erro de categoria se for variação
        }

        errors.imageUrl = ''
        return !errors.name && !errors.price && !errors.stock && (!form.idPai ? !errors.category : true)
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

    async function loadProduct(id) {
        if (!id) return

        isLoadingProduct.value = true
        try {
            const product = await getProductById(id)
            if (product) {
                form.name = product.name || product.Name || ''
                form.price = product.price || product.Price || null
                form.stock = product.stock || product.Stock || null
                form.description = product.description || product.Description || ''
                form.category = product.idCategory || product.IdCategory || product.categoryId || product.CategoryId || ''
                form.imageUrl = product.imageUrl || product.ImageUrl || ''
                form.idPai = product.idPai || product.IdPai || null
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error)
            showError('Erro', 'Não foi possível carregar os dados do produto.')
        } finally {
            isLoadingProduct.value = false
        }
    }

    // Load product data when productId changes or on mount
    watch(() => productId, (newId) => {
        if (newId) {
            loadProduct(newId)
        }
    }, { immediate: true })

    async function submitForm() {
        if (!validate()) return false

        isLoading.value = true
        showLoading(isEditMode.value ? 'Atualizando produto...' : 'Cadastrando produto...')

        // Declara variáveis no escopo da função para acessar no catch
        let finalCategoryId = null
        let finalIdPai = null
        let input = null

        try {
            // Se for variação (tem idPai), valida que idPai está definido
            finalIdPai = form.idPai ? (typeof form.idPai === 'string' ? form.idPai : String(form.idPai)) : null

            // Se for variação, busca o produto pai para pegar a categoria dele
            if (finalIdPai) {
                if (import.meta.env.DEV) {
                    console.log('Criando variação - idPai:', finalIdPai)
                }

                try {
                    const { getProductById } = await import('@/Services/ProductsService')
                    const parentProduct = await getProductById(finalIdPai)

                    if (!parentProduct) {
                        throw new Error('Produto pai não encontrado.')
                    }

                    if (import.meta.env.DEV) {
                        console.log('Produto pai recebido:', {
                            id: parentProduct.id,
                            name: parentProduct.name,
                            fullProduct: parentProduct,
                            keys: Object.keys(parentProduct)
                        })
                    }

                    // Extrai CategoryId do produto pai (pode estar em diferentes propriedades)
                    let categoryId = null
                    const possibleKeys = ['CategoryId', 'categoryId', 'category', 'idCategory', 'Category', 'CATEGORY_ID', 'IdCategory']

                    for (const key of possibleKeys) {
                        if (parentProduct.hasOwnProperty(key) && parentProduct[key] !== null && parentProduct[key] !== undefined) {
                            categoryId = parentProduct[key]
                            break
                        }
                    }

                    // Se não encontrou nas propriedades diretas, tenta no objeto category
                    if (!categoryId && parentProduct.category) {
                        if (typeof parentProduct.category === 'object' && parentProduct.category !== null) {
                            categoryId = parentProduct.category.id || parentProduct.category.Id || parentProduct.category.categoryId
                        } else if (typeof parentProduct.category === 'number') {
                            categoryId = parentProduct.category
                        } else if (typeof parentProduct.category === 'string' && !isNaN(parentProduct.category)) {
                            categoryId = parseInt(parentProduct.category, 10)
                        }
                    }

                    // Valida o categoryId encontrado
                    if (categoryId !== null && categoryId !== undefined) {
                        const categoryIdNum = Number(categoryId)

                        // Se for número válido, usa diretamente
                        if (!isNaN(categoryIdNum) && categoryIdNum > 0) {
                            finalCategoryId = categoryIdNum
                            if (import.meta.env.DEV) {
                                console.log('Categoria herdada do pai (número):', finalCategoryId)
                            }
                        }
                        // Se for string (UUID ou outro formato), aceita se for válida
                        else if (typeof categoryId === 'string' && categoryId.trim().length > 0) {
                            // Aceita UUIDs e outras strings válidas
                            finalCategoryId = categoryId.trim()
                            if (import.meta.env.DEV) {
                                console.log('Categoria herdada do pai (UUID/string):', finalCategoryId)
                            }
                        }
                        // Se for objeto, tenta extrair o ID
                        else if (typeof categoryId === 'object' && categoryId !== null) {
                            const extractedId = categoryId.id || categoryId.Id || categoryId.categoryId
                            if (extractedId) {
                                const extractedNum = Number(extractedId)
                                if (!isNaN(extractedNum) && extractedNum > 0) {
                                    finalCategoryId = extractedNum
                                } else if (typeof extractedId === 'string' && extractedId.trim().length > 0) {
                                    finalCategoryId = extractedId.trim()
                                }
                            }
                        }
                    }

                    if (!finalCategoryId) {
                        if (import.meta.env.DEV) {
                            console.error('Categoria não encontrada no produto pai:', {
                                productId: finalIdPai,
                                productName: parentProduct.name,
                                productKeys: Object.keys(parentProduct)
                            })
                        }
                        throw new Error('Produto pai não tem uma categoria válida definida.')
                    }
                } catch (error) {
                    closeLoading()
                    isLoading.value = false

                    let errorMessage = 'Não foi possível buscar informações do produto pai.'

                    // Mensagens mais específicas baseadas no erro
                    if (error.message) {
                        if (error.message.includes('não encontrado')) {
                            errorMessage = 'O produto pai selecionado não foi encontrado. Por favor, selecione outro produto.'
                        } else if (error.message.includes('categoria')) {
                            errorMessage = 'O produto pai selecionado não tem uma categoria válida. Por favor, escolha outro produto pai ou crie este produto sem variação.'
                        } else {
                            errorMessage = error.message
                        }
                    }

                    if (import.meta.env.DEV) {
                        console.error('Erro ao buscar produto pai:', error)
                    }

                    await showError('Erro ao criar variação', errorMessage)
                    return false
                }
            } else {
                // Se não for variação, usa a categoria selecionada
                const categoryValue = form.category

                // Valida se a categoria foi selecionada (não vazia, não null, não undefined)
                if (!categoryValue || categoryValue === '' || categoryValue === null || categoryValue === undefined) {
                    errors.category = 'Categoria é obrigatória. Selecione uma categoria.'
                    isLoading.value = false
                    closeLoading()
                    return false
                }

                // Aceita número ou string (UUID)
                if (typeof categoryValue === 'number') {
                    if (isNaN(categoryValue) || categoryValue <= 0) {
                        errors.category = 'Categoria inválida. Selecione uma categoria válida.'
                        isLoading.value = false
                        closeLoading()
                        return false
                    }
                    finalCategoryId = categoryValue
                } else if (typeof categoryValue === 'string') {
                    if (categoryValue.trim().length === 0) {
                        errors.category = 'Categoria é obrigatória. Selecione uma categoria.'
                        isLoading.value = false
                        closeLoading()
                        return false
                    }
                    finalCategoryId = categoryValue.trim()
                } else {
                    errors.category = 'Categoria inválida. Selecione uma categoria válida.'
                    isLoading.value = false
                    closeLoading()
                    return false
                }
            }

            // Validação final da categoria
            // Aceita número positivo OU string não vazia (UUID)
            const isValidCategory =
                (typeof finalCategoryId === 'number' && finalCategoryId > 0) ||
                (typeof finalCategoryId === 'string' && finalCategoryId.trim().length > 0)

            if (!finalCategoryId || !isValidCategory) {
                errors.category = 'Categoria inválida. Verifique o produto pai ou selecione uma categoria.'
                isLoading.value = false
                closeLoading()
                return false
            }

            // Monta o objeto de entrada garantindo tipos corretos
            input = {
                name: String(form.name).trim(),
                description: form.description ? String(form.description).trim() : null,
                price: Number(form.price) || 0,
                imageUrl: form.imageUrl ? String(form.imageUrl).trim() : null,
                stock: Number(form.stock) || 0,
                // idPai deve ser null se não houver, não undefined ou string vazia
                idPai: finalIdPai ? (typeof finalIdPai === 'string' ? finalIdPai.trim() : String(finalIdPai)) : null,
                // IdCategory: O backend espera IdCategory (não CategoryId)
                // Pode ser número OU UUID (string) - já validado acima
                IdCategory: typeof finalCategoryId === 'number'
                    ? parseInt(finalCategoryId, 10)
                    : String(finalCategoryId).trim()
            }

            // Validações adicionais antes de enviar
            if (!input.name || input.name.length === 0) {
                errors.name = 'Nome é obrigatório.'
                isLoading.value = false
                closeLoading()
                return false
            }

            if (input.price < 0) {
                errors.price = 'Preço deve ser maior ou igual a zero.'
                isLoading.value = false
                closeLoading()
                return false
            }

            if (input.stock < 0) {
                errors.stock = 'Estoque deve ser maior ou igual a zero.'
                isLoading.value = false
                closeLoading()
                return false
            }

            if (import.meta.env.DEV) {
                console.log('Dados enviados para criação:', {
                    name: input.name,
                    price: input.price,
                    stock: input.stock,
                    description: input.description,
                    imageUrl: input.imageUrl ? '...' : null,
                    idPai: input.idPai,
                    IdCategory: input.IdCategory,
                    IdCategoryType: typeof input.IdCategory
                })
            }

            const result = await store.create(input)

            if (import.meta.env.DEV) {
                console.log('Produto criado com sucesso:', result)
            }

            closeLoading()
            await showSuccess('Produto cadastrado!', 'O produto foi cadastrado com sucesso.')

            resetForm()
            return true
        } catch (error) {
            closeLoading()

            // Trata erros de forma mais clara
            let errorMessage = 'Não foi possível cadastrar o produto. Tente novamente.'

            // Verifica diferentes formatos de erro
            const errorMessageStr = error.message || ''
            const errorResponseData = error.response?.data

            if (errorResponseData) {
                if (typeof errorResponseData === 'string') {
                    errorMessage = errorResponseData
                } else if (errorResponseData.message) {
                    errorMessage = errorResponseData.message
                }
            } else if (errorMessageStr) {
                errorMessage = errorMessageStr
            }

            if (import.meta.env.DEV) {
                console.error('Erro ao criar produto:', error)
                console.error('Dados que tentaram ser enviados:', {
                    finalCategoryId: finalCategoryId || 'não definido',
                    idPai: form.idPai || null,
                    category: form.category || null,
                    name: form.name || null,
                    input: input || 'não criado'
                })
            }

            await showError('Erro ao cadastrar', errorMessage)
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
