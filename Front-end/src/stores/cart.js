import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAlerts } from '../composables/useAlerts'

// Chave para armazenar o carrinho no localStorage
const CART_STORAGE_KEY = 'fabrica-cart-items'
const CART_VERSION = '1.0' // Versionamento do carrinho

/**
 * Carrega o carrinho do localStorage
 * Valida versão e estrutura dos dados
 * @returns {Array} Array de itens do carrinho ou array vazio
 */
function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)

            // Verifica se tem versão (novo formato)
            if (parsed.version && parsed.version === CART_VERSION && Array.isArray(parsed.items)) {
                return parsed.items
            }

            // Formato antigo (apenas array)
            if (Array.isArray(parsed)) {
                return parsed
            }
        }
    } catch (error) {
        // Em caso de erro, limpa dados corrompidos
        try {
            localStorage.removeItem(CART_STORAGE_KEY)
        } catch (e) {
            // Ignora erro ao limpar
        }
    }
    return []
}

/**
 * Salva o carrinho no localStorage com versionamento
 * @param {Array} cartItems - Array de itens do carrinho
 */
function saveCartToStorage(cartItems) {
    try {
        const dataToStore = {
            version: CART_VERSION,
            items: cartItems,
            lastUpdate: new Date().toISOString()
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToStore))
    } catch (error) {
        // Se não conseguir salvar (ex: quota excedida), apenas loga o erro
        // Não quebra a aplicação
    }
}

// Store do carrinho de compras usando Pinia
export const useCartStore = defineStore('cart', () => {
    // Flag para evitar salvar durante o carregamento inicial
    let isInitializing = true

    // Carrega itens do localStorage
    const loadedItems = loadCartFromStorage()

    // Array que armazena os itens do carrinho
    // Carrega do localStorage ao inicializar
    // Cada item possui: id, name, price, imageUrl, quantity
    const items = ref(loadedItems)

    // Marca como inicializado após um pequeno delay
    // Isso evita que o watch salve durante o carregamento inicial
    setTimeout(() => {
        isInitializing = false
    }, 200)

    // Composables para alertas
    const { showSuccessToast, showError, showConfirm, showSuccess } = useAlerts()

    // Computed: Retorna o total de itens no carrinho (soma das quantidades)
    const totalItems = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0)
    })

    // Computed: Retorna o valor total do carrinho (soma dos preços * quantidades)
    const totalPrice = computed(() => {
        return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    })

    // Computed: Verifica se o carrinho está vazio
    const isEmpty = computed(() => {
        return items.value.length === 0
    })

    // Observa mudanças no carrinho e salva automaticamente no localStorage
    // Não salva durante a inicialização para evitar sobrescrever dados
    watch(
        items,
        (newItems) => {
            // Só salva se não estiver inicializando
            if (!isInitializing) {
                saveCartToStorage(newItems)
            }
        },
        { deep: true } // Observa mudanças profundas (quantidade, etc)
    )

    /**
     * Adiciona um produto ao carrinho
     * Se o produto já existir, aumenta a quantidade
     * Valida estoque disponível antes de adicionar
     * @param {Object} product - Produto a ser adicionado
     */
    function addToCart(product) {
        try {
            // Valida se o produto tem os dados necessários
            if (!product || !product.id) {
                showError('Erro', 'Produto inválido.')
                return
            }

            // Verifica se o produto já está no carrinho
            const existingItem = items.value.find(item => item.id === product.id)

            if (existingItem) {
                // Verifica estoque disponível
                const stockAvailable = product.stock !== undefined ? product.stock : Infinity
                const currentQuantity = existingItem.quantity

                if (currentQuantity >= stockAvailable) {
                    showError('Estoque insuficiente', `Não há mais estoque disponível para "${product.name}".`)
                    return
                }

                // Se já existe e tem estoque, aumenta a quantidade
                existingItem.quantity += 1
                showSuccessToast(`${product.name} adicionado ao carrinho! (Quantidade: ${existingItem.quantity})`)
            } else {
                // Verifica se há estoque disponível
                const stockAvailable = product.stock !== undefined ? product.stock : Infinity

                if (stockAvailable < 1) {
                    showError('Estoque insuficiente', `Não há estoque disponível para "${product.name}".`)
                    return
                }

                // Se não existe, adiciona novo item com quantidade 1
                items.value.push({
                    ...product,
                    quantity: 1
                })
                showSuccessToast(`${product.name} adicionado ao carrinho!`)
            }

            // Força salvamento imediato (além do watch)
            saveCartToStorage(items.value)
        } catch (error) {
            showError('Erro', 'Não foi possível adicionar o produto ao carrinho.')
        }
    }

    /**
     * Remove um item completamente do carrinho
     * @param {Number} productId - ID do produto a ser removido
     */
    async function removeFromCart(productId) {
        try {
            // Encontra o item no carrinho
            const item = items.value.find(item => item.id === productId)

            if (!item) {
                showError('Erro', 'Produto não encontrado no carrinho.')
                return
            }

            // Confirmação antes de remover
            const result = await showConfirm(
                'Remover do Carrinho',
                `Tem certeza que deseja remover "${item.name}" do carrinho?`,
                'Sim, remover',
                'Cancelar'
            )

            if (result.isConfirmed) {
                // Remove o item do array
                items.value = items.value.filter(item => item.id !== productId)
                // Força salvamento imediato
                saveCartToStorage(items.value)
                showSuccessToast(`${item.name} removido do carrinho!`)
            }
        } catch (error) {
            showError('Erro', 'Não foi possível remover o produto do carrinho.')
        }
    }

    /**
     * Aumenta a quantidade de um item no carrinho
     * Valida estoque antes de aumentar
     * @param {Number} productId - ID do produto
     */
    function increaseQuantity(productId) {
        const item = items.value.find(item => item.id === productId)

        if (item) {
            // Verifica estoque disponível
            const stockAvailable = item.stock !== undefined ? item.stock : Infinity

            if (item.quantity >= stockAvailable) {
                showError('Estoque insuficiente', `Não há mais estoque disponível para "${item.name}".`)
                return
            }

            item.quantity += 1
            // Força salvamento imediato
            saveCartToStorage(items.value)
        }
    }

    /**
     * Diminui a quantidade de um item no carrinho
     * Se a quantidade chegar a 0, remove o item
     * @param {Number} productId - ID do produto
     */
    function decreaseQuantity(productId) {
        const item = items.value.find(item => item.id === productId)

        if (item) {
            if (item.quantity > 1) {
                // Diminui a quantidade se for maior que 1
                item.quantity -= 1
                // Força salvamento imediato
                saveCartToStorage(items.value)
            } else {
                // Se for 1, remove o item
                removeFromCart(productId)
            }
        }
    }

    /**
     * Limpa todo o carrinho
     * Também remove do localStorage
     */
    function clearCart() {
        items.value = []
        // Remove do localStorage (o watch também faria isso, mas é mais explícito)
        localStorage.removeItem(CART_STORAGE_KEY)
    }

    /**
     * Finaliza a compra (checkout)
     * Atualiza estoque no backend para cada produto
     */
    async function checkout() {
        try {
            // Verifica se o carrinho está vazio
            if (items.value.length === 0) {
                showError('Carrinho Vazio', 'Adicione produtos ao carrinho antes de finalizar a compra.')
                return false
            }

            // Confirmação antes de finalizar
            const result = await showConfirm(
                'Finalizar Compra',
                `Confirma a compra de ${totalItems.value} item(ns) por R$ ${totalPrice.value.toFixed(2)}?`,
                'Sim, finalizar',
                'Cancelar'
            )

            if (result.isConfirmed) {
                // Importa o service para atualizar estoque
                const { updateProductStock } = await import('../Services/ProductsService')

                try {
                    // Atualiza estoque de cada produto no backend
                    const updatePromises = items.value.map(async (item) => {
                        if (item.stock !== undefined && item.id) {
                            try {
                                return await updateProductStock(item.id, item.quantity)
                            } catch (error) {
                                // Re-lança o erro com informações do produto
                                const errorWithProduct = new Error(`Erro ao atualizar produto ${item.name || item.id}: ${error.message}`)
                                errorWithProduct.originalError = error
                                errorWithProduct.productId = item.id
                                errorWithProduct.productName = item.name
                                throw errorWithProduct
                            }
                        }
                        return Promise.resolve()
                    })

                    // Aguarda todas as atualizações
                    await Promise.all(updatePromises)

                    // Mostra mensagem de sucesso
                    showSuccess(
                        'Compra Finalizada!',
                        `Sua compra foi processada com sucesso. Total: R$ ${totalPrice.value.toFixed(2)}`
                    )

                    // Limpa o carrinho após a compra
                    clearCart()

                    // Recarrega produtos para atualizar estoque na lista
                    // Emite evento customizado para que a view atualize
                    window.dispatchEvent(new CustomEvent('cart-checkout-completed'))

                    return true
                } catch (updateError) {
                    // Trata erros de atualização de estoque
                    let errorMessage = 'Não foi possível finalizar a compra.'

                    // Verifica se é erro de foreign key constraint
                    const originalError = updateError.originalError || updateError
                    const errorStr = (originalError.message || '').toLowerCase()
                    const errorResponseData = originalError.response?.data
                    let errorDataString = ''

                    if (errorResponseData) {
                        if (typeof errorResponseData === 'string') {
                            errorDataString = errorResponseData.toLowerCase()
                        } else if (errorResponseData.message) {
                            errorDataString = errorResponseData.message.toLowerCase()
                        } else {
                            errorDataString = JSON.stringify(errorResponseData).toLowerCase()
                        }
                    }

                    const fullErrorString = errorStr + ' ' + errorDataString

                    if (fullErrorString.includes('foreign key') ||
                        fullErrorString.includes('categoryid') ||
                        fullErrorString.includes('fk_products_categories') ||
                        fullErrorString.includes('cannot add or update')) {
                        errorMessage = `Erro ao atualizar estoque: o produto "${updateError.productName || updateError.productId}" tem uma categoria inválida. Por favor, remova este produto do carrinho e tente novamente.`
                    } else if (updateError.productName) {
                        errorMessage = `Erro ao atualizar o produto "${updateError.productName}". Por favor, tente novamente.`
                    }

                    showError('Erro ao finalizar compra', errorMessage)
                    return false
                }
            }

            return false
        } catch (error) {
            // Trata erros gerais
            let errorMessage = 'Não foi possível finalizar a compra. Verifique se o backend está disponível.'

            const errorStr = (error.message || '').toLowerCase()
            if (errorStr.includes('network') || errorStr.includes('connection')) {
                errorMessage = 'Erro de conexão. Verifique se o backend está rodando.'
            }

            showError('Erro', errorMessage)
            return false
        }
    }

    // Retorna tudo que será exposto pela store
    return {
        items,
        totalItems,
        totalPrice,
        isEmpty,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        checkout
    }
})

