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
    let loadedItems = []
    try {
        loadedItems = loadCartFromStorage()
    } catch (error) {
        // Em caso de erro, inicia com array vazio
        loadedItems = []
        if (import.meta.env.DEV) {
            console.error('Erro ao carregar carrinho do localStorage:', error)
        }
    }

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
        if (!items.value || items.value.length === 0) return 0
        return items.value.reduce((total, item) => {
            const qty = item.quantity || 0
            return total + qty
        }, 0)
    })

    // Computed: Retorna o valor total do carrinho (soma dos preços * quantidades)
    const totalPrice = computed(() => {
        if (!items.value || items.value.length === 0) return 0
        return items.value.reduce((total, item) => {
            const price = item.price || 0
            const qty = item.quantity || 0
            return total + (price * qty)
        }, 0)
    })

    // Computed: Verifica se o carrinho está vazio
    const isEmpty = computed(() => {
        return !items.value || items.value.length === 0
    })

    // Observa mudanças no carrinho e salva automaticamente no localStorage
    // Não salva durante a inicialização para evitar sobrescrever dados
    // Usa flush: 'post' para evitar múltiplas chamadas durante atualizações
    watch(
        items,
        (newItems) => {
            // Só salva se não estiver inicializando
            if (!isInitializing) {
                // Usa setTimeout para evitar múltiplas chamadas muito rápidas
                clearTimeout(window._cartSaveTimeout)
                window._cartSaveTimeout = setTimeout(() => {
                    saveCartToStorage(newItems)
                }, 100)
            }
        },
        { deep: true, flush: 'post' } // Observa mudanças profundas (quantidade, etc)
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

                // Atualiza propriedades do produto (pode ter mudado)
                // Garante que imageUrl seja atualizado se existir no produto
                if (product.imageUrl) {
                    existingItem.imageUrl = product.imageUrl
                }
                existingItem.name = product.name || existingItem.name
                existingItem.price = product.price !== undefined ? product.price : existingItem.price
                existingItem.stock = product.stock !== undefined ? product.stock : existingItem.stock

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
                // Garante que imageUrl seja copiado explicitamente
                items.value.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl || null,
                    stock: product.stock,
                    description: product.description,
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
     * Cria um pedido (Order) no backend via POST
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
                // Importa o service para criar pedido
                const { createOrder } = await import('../Services/OrderService')

                try {
                    // Prepara os dados do pedido
                    // Monta os itens do pedido baseado nos itens do carrinho
                    const orderItems = items.value.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))

                    // Monta o objeto do pedido
                    const orderData = {
                        items: orderItems,
                        total: totalPrice.value
                    }

                    if (import.meta.env.DEV) {
                        console.log('Criando pedido:', orderData)
                    }

                    // Cria o pedido no backend
                    const createdOrder = await createOrder(orderData)

                    if (import.meta.env.DEV) {
                        console.log('Pedido criado com sucesso:', createdOrder)
                    }

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
                } catch (orderError) {
                    // Trata erros de criação de pedido
                    let errorMessage = 'Não foi possível finalizar a compra.'

                    // Verifica se é erro de foreign key constraint
                    const originalError = orderError.originalError || orderError
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
                        errorMessage = `Erro ao criar pedido: um dos produtos tem uma categoria inválida. Por favor, remova o produto do carrinho e tente novamente.`
                    } else if (fullErrorString.includes('stock') || fullErrorString.includes('estoque')) {
                        errorMessage = `Erro ao criar pedido: não há estoque suficiente para um dos produtos. Verifique o carrinho e tente novamente.`
                    } else if (errorResponseData && typeof errorResponseData === 'object') {
                        // Tenta extrair mensagem mais específica do backend
                        const backendMessage = errorResponseData.message || errorResponseData.title || errorResponseData.detail
                        if (backendMessage) {
                            errorMessage = `Erro ao criar pedido: ${backendMessage}`
                        }
                    }

                    if (import.meta.env.DEV) {
                        console.error('Erro ao criar pedido:', orderError)
                        console.error('Dados do pedido:', orderData)
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

