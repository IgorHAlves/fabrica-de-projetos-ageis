import { reactive, ref, watch } from 'vue'
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
        if (touched.category) {
            const categoryId = Number(newValue)
            errors.category = (categoryId && categoryId > 0) ? '' : 'Categoria é obrigatória.'
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
                const categoryId = Number(form.category)
                errors.category = (categoryId && categoryId > 0) ? '' : 'Categoria é obrigatória.'
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

    async function submitForm() {
        if (!validate()) return false

        isLoading.value = true
        showLoading('Cadastrando produto...')

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
                    const possibleKeys = ['CategoryId', 'categoryId', 'category', 'idCategory', 'Category', 'CATEGORY_ID']

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
                            // Não precisa validar como número - o backend aceita UUIDs
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
                const categoryId = Number(form.category)
                if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
                    errors.category = 'Categoria inválida. Selecione uma categoria válida.'
                    isLoading.value = false
                    closeLoading()
                    return false
                }
                finalCategoryId = categoryId
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

            // Validação: Verificar se a categoria existe no banco antes de criar o produto
            try {
                const { getCategoryById } = await import('@/Services/CategoriesService')
                const categoryExists = await getCategoryById(finalCategoryId)

                if (!categoryExists || !categoryExists.id) {
                    errors.category = 'A categoria selecionada não existe mais no sistema. Por favor, recarregue a página e selecione uma categoria válida.'
                    isLoading.value = false
                    closeLoading()
                    await showError('Categoria inválida', 'A categoria não foi encontrada no banco de dados. Isso pode acontecer se ela foi removida. Por favor, recarregue a página e tente novamente com uma categoria válida.')
                    return false
                }

                if (import.meta.env.DEV) {
                    console.log('Categoria validada com sucesso:', {
                        categoryId: finalCategoryId,
                        categoryName: categoryExists.name || 'Sem nome',
                        category: categoryExists
                    })
                }
            } catch (categoryError) {
                // Se não conseguir verificar a categoria, continua mas loga o erro
                if (import.meta.env.DEV) {
                    console.warn('Não foi possível verificar se a categoria existe:', categoryError)
                }
                // Não bloqueia a criação - o backend vai validar de qualquer forma
            }

            // Validação: Se for variação, verificar se o produto pai realmente existe e é válido
            if (finalIdPai) {
                try {
                    const { getProductById } = await import('@/Services/ProductsService')
                    const parentProductCheck = await getProductById(finalIdPai)

                    if (!parentProductCheck || !parentProductCheck.id) {
                        errors.category = 'O produto pai selecionado não existe mais. Por favor, selecione outro produto ou crie este produto sem variação.'
                        isLoading.value = false
                        closeLoading()
                        await showError('Produto pai inválido', 'O produto pai selecionado não foi encontrado no sistema. Isso pode acontecer se ele foi removido. Por favor, selecione outro produto ou crie este produto sem variação.')
                        return false
                    }

                    if (import.meta.env.DEV) {
                        console.log('Produto pai validado com sucesso:', {
                            idPai: finalIdPai,
                            productName: parentProductCheck.name || 'Sem nome'
                        })
                    }
                } catch (parentError) {
                    // Se não conseguir verificar, mostra erro
                    if (import.meta.env.DEV) {
                        console.error('Erro ao verificar produto pai:', parentError)
                    }
                    errors.category = 'Não foi possível verificar o produto pai. Por favor, tente novamente.'
                    isLoading.value = false
                    closeLoading()
                    await showError('Erro de validação', 'Não foi possível verificar se o produto pai existe. Por favor, tente novamente.')
                    return false
                }
            }

            // Validação de formato: Verifica se CategoryId tem formato válido (UUID ou número)
            const categoryIdString = typeof finalCategoryId === 'string' ? finalCategoryId.trim() : String(finalCategoryId)
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

            if (typeof finalCategoryId === 'string') {
                // Se for string, verifica se é UUID válido
                if (!uuidPattern.test(categoryIdString)) {
                    errors.category = 'Formato de categoria inválido. A categoria deve ser um UUID válido ou um número.'
                    isLoading.value = false
                    closeLoading()
                    await showError('Formato inválido', 'O ID da categoria não está em um formato válido. Por favor, recarregue a página e selecione uma categoria válida.')
                    return false
                }
            }

            // Validação de formato: Verifica se idPai tem formato válido (UUID) quando presente
            if (finalIdPai) {
                const idPaiString = typeof finalIdPai === 'string' ? finalIdPai.trim() : String(finalIdPai)
                if (!uuidPattern.test(idPaiString)) {
                    errors.category = 'Formato de produto pai inválido. O ID deve ser um UUID válido.'
                    isLoading.value = false
                    closeLoading()
                    await showError('Formato inválido', 'O ID do produto pai não está em um formato válido. Por favor, selecione outro produto ou crie este produto sem variação.')
                    return false
                }
            }

            // Monta o objeto de entrada garantindo tipos corretos e formatos válidos
            // IMPORTANTE: O backend espera IdCategory (não CategoryId) conforme CreateProductDTO
            input = {
                name: String(form.name).trim(),
                description: form.description ? String(form.description).trim() : null,
                price: Number(form.price) || 0,
                imageUrl: form.imageUrl ? String(form.imageUrl).trim() : null,
                stock: Number(form.stock) || 0,
                // idPai deve ser null se não houver, não undefined ou string vazia
                // Se presente, deve ser UUID válido (string) - o backend faz Guid.Parse
                idPai: finalIdPai ? (typeof finalIdPai === 'string' ? finalIdPai.trim() : String(finalIdPai)) : null,
                // IdCategory: O backend espera IdCategory (não CategoryId)
                // Pode ser número OU UUID (string) - já validado acima
                IdCategory: typeof finalCategoryId === 'number'
                    ? parseInt(finalCategoryId, 10)
                    : String(finalCategoryId).trim()
            }

            // Validação final dos dados antes de enviar
            if (import.meta.env.DEV) {
                console.log('Validação final dos dados:', {
                    name: input.name,
                    nameLength: input.name.length,
                    price: input.price,
                    priceType: typeof input.price,
                    stock: input.stock,
                    stockType: typeof input.stock,
                    hasImage: !!input.imageUrl,
                    idPai: input.idPai,
                    idPaiType: typeof input.idPai,
                    IdCategory: input.IdCategory,
                    IdCategoryType: typeof input.IdCategory,
                    isValidUUID: input.IdCategory ? uuidPattern.test(String(input.IdCategory)) : false
                })
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

            // Trata erros de foreign key constraint
            let errorMessage = 'Não foi possível cadastrar o produto. Tente novamente.'

            // Verifica diferentes formatos de erro
            const errorMessageStr = error.message || ''
            const errorResponseData = error.response?.data
            let errorDataString = ''
            let innerException = ''

            // Função auxiliar para extrair mensagens de erro do stack trace
            function extractErrorMessageFromStackTrace(stackTrace) {
                if (!stackTrace || typeof stackTrace !== 'string') return ''

                // Extrai a primeira linha (geralmente contém a mensagem principal)
                const firstLine = stackTrace.split('\n')[0]?.trim() || ''

                // Procura por mensagens úteis na primeira linha
                // Exemplo: "System.Exception: Erro ao criar produtoAn error occurred..."
                const messageMatch = firstLine.match(/:\s*(.+?)(?:\s+at\s|$)/i)
                if (messageMatch && messageMatch[1]) {
                    const messages = messageMatch[1]
                    // Se houver múltiplas mensagens concatenadas, separa elas
                    const parts = messages.split(/(?:An error occurred|See the inner exception|System\.)/i)
                    if (parts.length > 1) {
                        // Retorna a primeira parte (geralmente a mensagem customizada)
                        return parts[0].trim()
                    }
                    return messages.trim()
                }

                // Procura por padrões comuns de erro do Entity Framework em todo o texto
                const patterns = [
                    /FK_\w+(?:\s+\w+)*/gi, // Foreign keys como FK_Products_Categories
                    /foreign key constraint[^\.]+/gi,
                    /cannot insert [^\.]+/gi,
                    /cannot add or update [^\.]+/gi,
                    /reference constraint[^\.]+/gi,
                    /The INSERT[^\.]+/gi,
                    /The UPDATE[^\.]+/gi,
                    /required field[^\.]+/gi,
                    /NOT NULL[^\.]+/gi,
                    /duplicate key[^\.]+/gi,
                    /unique constraint[^\.]+/gi,
                    /unique key[^\.]+/gi,
                    /constraint violation[^\.]+/gi
                ]

                const foundErrors = []
                for (const pattern of patterns) {
                    const matches = stackTrace.match(pattern)
                    if (matches) {
                        foundErrors.push(...matches.map(m => m.trim()))
                    }
                }

                // Remove duplicatas e retorna
                if (foundErrors.length > 0) {
                    const uniqueErrors = [...new Set(foundErrors)]
                    return uniqueErrors.join('; ')
                }

                // Tenta extrair a primeira linha útil (ignora stack trace)
                const lines = stackTrace.split('\n')
                for (const line of lines) {
                    const trimmed = line.trim()
                    // Ignora linhas de stack trace e busca mensagens de erro
                    if (trimmed &&
                        !trimmed.includes('at ') &&
                        !trimmed.includes('Stack trace') &&
                        !trimmed.includes('HEADERS') &&
                        !trimmed.includes('=======') &&
                        trimmed.length > 20 &&
                        (trimmed.includes('error') ||
                            trimmed.includes('Error') ||
                            trimmed.includes('exception') ||
                            trimmed.includes('Exception') ||
                            trimmed.includes('failed') ||
                            trimmed.includes('Failed'))) {
                        return trimmed.substring(0, 300).trim()
                    }
                }

                // Retorna as primeiras 200 caracteres da string como fallback
                return stackTrace.substring(0, 200).trim()
            }

            // Função recursiva para extrair innerException de estruturas aninhadas
            function extractInnerException(obj, depth = 0) {
                if (depth > 5) return '' // Evita recursão infinita
                if (!obj || typeof obj !== 'object') return ''

                // Tenta diferentes propriedades
                const possibleKeys = [
                    'innerException', 'InnerException', 'inner', 'Inner',
                    'innerExceptionMessage', 'InnerExceptionMessage',
                    'exception', 'Exception', 'detail', 'Detail',
                    'error', 'Error', 'message', 'Message'
                ]

                for (const key of possibleKeys) {
                    if (obj[key]) {
                        if (typeof obj[key] === 'string') {
                            return obj[key]
                        } else if (typeof obj[key] === 'object') {
                            const nested = extractInnerException(obj[key], depth + 1)
                            if (nested) return nested
                        }
                    }
                }

                // Tenta iterar sobre propriedades do objeto
                for (const key in obj) {
                    if (obj.hasOwnProperty(key) && typeof obj[key] === 'string' && obj[key].length > 10) {
                        // Se encontrar uma string longa que pareça uma mensagem de erro
                        if (key.toLowerCase().includes('exception') ||
                            key.toLowerCase().includes('error') ||
                            key.toLowerCase().includes('message')) {
                            return obj[key]
                        }
                    }
                }

                return ''
            }

            if (errorResponseData) {
                if (typeof errorResponseData === 'string') {
                    errorDataString = errorResponseData

                    // Tenta parsear como JSON se for uma string JSON
                    try {
                        const parsed = JSON.parse(errorResponseData)
                        if (parsed && typeof parsed === 'object') {
                            errorResponseData = parsed
                            // Continua o processamento como objeto abaixo
                        } else {
                            // É string simples, tenta extrair informações úteis do stack trace
                            innerException = extractErrorMessageFromStackTrace(errorResponseData)
                        }
                    } catch {
                        // Não é JSON, é string simples (stack trace)
                        // Tenta extrair informações úteis do stack trace
                        innerException = extractErrorMessageFromStackTrace(errorResponseData)
                    }

                    // Se ainda não processou como objeto JSON, usa a string diretamente
                    if (typeof errorResponseData === 'string') {
                        innerException = innerException || errorResponseData
                    }
                }

                // Processa como objeto se não for string
                if (typeof errorResponseData === 'object' && errorResponseData !== null) {
                    // Tenta extrair mensagem principal
                    errorDataString = errorResponseData.message ||
                        errorResponseData.Message ||
                        errorResponseData.error?.message ||
                        errorResponseData.title ||
                        errorDataString ||
                        JSON.stringify(errorResponseData)

                    // Extrai innerException usando função recursiva
                    innerException = extractInnerException(errorResponseData) || innerException

                    // Se não encontrou, tenta propriedades diretas
                    if (!innerException) {
                        innerException = errorResponseData.innerException ||
                            errorResponseData.InnerException ||
                            errorResponseData.error?.innerException ||
                            errorResponseData.detail ||
                            errorResponseData.Detail ||
                            innerException ||
                            ''
                    }
                }
            }

            // Log detalhado da innerException
            if (import.meta.env.DEV) {
                console.error('=== ERRO AO CRIAR PRODUTO ===')
                console.error('Mensagem:', errorMessageStr)
                console.error('Status:', error.response?.status, error.response?.statusText)
                console.error('Response Data completo:', errorResponseData)
                if (innerException) {
                    console.error('=== INNER EXCEPTION (ERRO REAL DO BACKEND) ===')
                    console.error(innerException)
                    console.error('=============================================')
                }
                console.error('Dados enviados:', input)
                console.error('=============================================')
            }

            // Concatena todas as strings de erro para busca
            const fullErrorString = (errorMessageStr + ' ' + errorDataString + ' ' + innerException).toLowerCase()

            // Verifica tipos específicos de erro do Entity Framework
            if (fullErrorString.includes('foreign key') ||
                fullErrorString.includes('fk_products_categories') ||
                fullErrorString.includes('fk_') ||
                fullErrorString.includes('cannot insert') ||
                fullErrorString.includes('cannot add or update') ||
                fullErrorString.includes('reference constraint') ||
                fullErrorString.includes('the insert statement conflicted')) {
                // Erro de foreign key constraint
                errorMessage = 'Erro de relacionamento:\n'
                errorMessage += 'A categoria selecionada não existe ou foi removida do sistema.\n\n'
                errorMessage += 'Soluções:\n'
                errorMessage += '• Recarregue a página\n'
                errorMessage += '• Verifique se a categoria ainda existe\n'
                errorMessage += '• Selecione uma categoria válida e tente novamente'
                if (innerException) {
                    errorMessage += `\n\nDetalhes técnicos: ${innerException}`
                }
                errors.category = 'Categoria inválida. Recarregue a página e selecione novamente.'
            } else if (fullErrorString.includes('idcategory') ||
                fullErrorString.includes('category') && fullErrorString.includes('not found')) {
                // Categoria não encontrada
                errorMessage = 'Categoria não encontrada:\n'
                errorMessage += 'A categoria selecionada não existe mais no sistema.\n\n'
                errorMessage += 'Por favor, recarregue a página e selecione uma categoria válida.'
                if (innerException) {
                    errorMessage += `\n\nDetalhes: ${innerException}`
                }
                errors.category = 'Categoria não encontrada. Recarregue a página.'
            } else if (fullErrorString.includes('idpai') &&
                (fullErrorString.includes('not found') || fullErrorString.includes('não encontrado'))) {
                // Produto pai não encontrado
                errorMessage = 'Produto pai inválido:\n'
                errorMessage += 'O produto pai selecionado não existe mais no sistema.\n\n'
                errorMessage += 'Soluções:\n'
                errorMessage += '• Selecione outro produto pai\n'
                errorMessage += '• Ou crie este produto sem variação (sem produto pai)'
                if (innerException) {
                    errorMessage += `\n\nDetalhes: ${innerException}`
                }
            } else if (fullErrorString.includes('cannot insert null') ||
                fullErrorString.includes('required') ||
                fullErrorString.includes('not null') ||
                fullErrorString.includes('is required')) {
                // Campo obrigatório faltando
                errorMessage = 'Campos obrigatórios faltando:\n'
                errorMessage += 'Alguns campos obrigatórios não foram preenchidos corretamente.\n\n'
                errorMessage += 'Verifique:\n'
                errorMessage += '• Nome do produto\n'
                errorMessage += '• Preço\n'
                errorMessage += '• Estoque\n'
                errorMessage += '• Categoria\n'
                errorMessage += '• Imagem'
                if (innerException) {
                    errorMessage += `\n\nDetalhes: ${innerException}`
                }
            } else if (fullErrorString.includes('duplicate') ||
                fullErrorString.includes('unique constraint') ||
                fullErrorString.includes('duplicado') ||
                fullErrorString.includes('unique key')) {
                // Valor duplicado
                errorMessage = 'Produto duplicado:\n'
                errorMessage += 'Já existe um produto com essas informações no sistema.\n\n'
                errorMessage += 'Verifique se o produto já foi cadastrado anteriormente.'
                if (innerException) {
                    errorMessage += `\n\nDetalhes: ${innerException}`
                }
            } else if (fullErrorString.includes('saving the entity') ||
                fullErrorString.includes('entity changes') ||
                fullErrorString.includes('save changes') ||
                fullErrorString.includes('savechanges')) {
                // Erro genérico de salvar entidade
                errorMessage = 'Erro ao salvar no banco de dados:\n\n'
                if (innerException) {
                    // Prioriza innerException que geralmente tem a mensagem real
                    errorMessage += `${innerException}`
                } else if (errorDataString && !errorDataString.includes('error occurred')) {
                    errorMessage += errorDataString
                } else {
                    errorMessage += 'Ocorreu um erro ao tentar salvar o produto.\n\n'
                    errorMessage += 'Possíveis causas:\n'
                    errorMessage += '• Categoria inválida ou não existe mais\n'
                    errorMessage += '• Produto pai inválido (se for variação)\n'
                    errorMessage += '• Campos obrigatórios faltando\n'
                    errorMessage += '• Dados inválidos no formulário\n'
                    errorMessage += '• Problema de conexão com o banco de dados'
                    if (import.meta.env.DEV) {
                        errorMessage += `\n\n(Verifique o console do navegador para mais detalhes)`
                    }
                }
            } else if (error.message && error.message.includes('timeout')) {
                // Erro de timeout
                errorMessage = 'Timeout do servidor:\n'
                errorMessage += 'O servidor demorou muito para responder.\n\n'
                errorMessage += 'O produto pode ter sido criado, mas a resposta não chegou a tempo.\n'
                errorMessage += 'Verifique a lista de produtos para confirmar.'
            } else if (fullErrorString.includes('guid') && fullErrorString.includes('format')) {
                // Erro de formato GUID
                errorMessage = 'Formato inválido:\n'
                errorMessage += 'Um dos IDs enviados não está em formato válido (UUID).\n\n'
                errorMessage += 'Por favor, recarregue a página e tente novamente.'
                if (innerException) {
                    errorMessage += `\n\nDetalhes: ${innerException}`
                }
            } else if (innerException) {
                // Se tem innerException, usa ela como mensagem principal
                errorMessage = `Erro ao criar produto:\n\n${innerException}`
            } else if (errorDataString && errorDataString !== 'Erro ao criar produto') {
                // Usa a mensagem do backend se disponível
                errorMessage = errorDataString
            }

            // Se innerException existe e não foi incluída, adiciona como detalhes
            if (innerException && !errorMessage.includes(innerException)) {
                errorMessage += `\n\nDetalhes técnicos: ${innerException}`
            }

            // Log apenas em desenvolvimento
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
