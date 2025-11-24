import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAlerts } from '../composables/useAlerts'
import { createOrder } from '../Services/OrdersService'
import { calculateDiscount } from '../Services/CouponsService'
import { getShipping } from '../Services/ShippingService'

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

    // Cupom aplicado
    const appliedCoupon = ref(null)
    const discountValue = ref(0)

    // Frete
    const shippingPrice = ref(0)
    const shippingAddress = ref(null)
    const shippingCep = ref('')

    // Marca como inicializado após um pequeno delay
    // Isso evita que o watch salve durante o carregamento inicial
    setTimeout(() => {
        isInitializing = false
    }, 200)

    // Composables para alertas
    const { showSuccessToast, showError, showConfirm, showSuccess, showLoading, closeLoading } = useAlerts()

    // Computed: Retorna o total de itens no carrinho (soma das quantidades)
    const totalItems = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0)
    })

    // Computed: Retorna o valor total do carrinho (soma dos preços * quantidades)
    const totalPrice = computed(() => {
        return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    })

    // Computed: Retorna o valor total com desconto
    const totalPriceWithDiscount = computed(() => {
        const total = totalPrice.value
        const totalWithDiscount = Math.max(0, total - discountValue.value)
        return totalWithDiscount + shippingPrice.value
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
        appliedCoupon.value = null
        discountValue.value = 0
        shippingPrice.value = 0
        shippingAddress.value = null
        shippingCep.value = ''
        // Remove do localStorage (o watch também faria isso, mas é mais explícito)
        localStorage.removeItem(CART_STORAGE_KEY)
    }

    /**
     * Calcula o frete baseado no CEP
     * @param {String} cep - CEP para calcular o frete
     */
    async function calculateShipping(cep) {
        try {
            if (!cep || !cep.trim()) {
                showError('CEP inválido', 'Por favor, informe um CEP válido.')
                return false
            }

            // Remove formatação do CEP
            const cleanCep = cep.replace(/\D/g, '')

            if (cleanCep.length !== 8) {
                showError('CEP inválido', 'O CEP deve conter 8 dígitos.')
                return false
            }

            showLoading('Calculando frete...')

            try {
                const shippingData = await getShipping(cleanCep)

                // Suporta tanto camelCase quanto PascalCase
                shippingPrice.value = shippingData.shippingRate || shippingData.ShippingRate || 0
                shippingAddress.value = shippingData.address || shippingData.Address || null
                shippingCep.value = cleanCep

                closeLoading()
                showSuccessToast(`Frete calculado: R$ ${shippingPrice.value.toFixed(2)}`)
                return true
            } catch (apiError) {
                closeLoading()
                const errorMessage = apiError.response?.data?.message ||
                    apiError.message ||
                    'Não foi possível calcular o frete. Verifique o CEP e tente novamente.'
                showError('Erro ao calcular frete', errorMessage)
                return false
            }
        } catch (error) {
            closeLoading()
            showError('Erro', 'Não foi possível calcular o frete.')
            return false
        }
    }

    /**
     * Remove o frete calculado
     */
    function removeShipping() {
        shippingPrice.value = 0
        shippingAddress.value = null
        shippingCep.value = ''
    }

    /**
     * Aplica um cupom ao carrinho
     * @param {Object} coupon - Cupom { code, value, categoryEnum }
     */
    function applyCoupon(coupon) {
        appliedCoupon.value = coupon
        discountValue.value = calculateDiscount(coupon, totalPrice.value)
    }

    /**
     * Remove o cupom aplicado
     */
    function removeCoupon() {
        appliedCoupon.value = null
        discountValue.value = 0
    }

    // Watch para recalcular desconto quando o total muda
    watch(totalPrice, (newTotal) => {
        if (appliedCoupon.value) {
            discountValue.value = calculateDiscount(appliedCoupon.value, newTotal)
        }
    })

    /**
     * Finaliza a compra (checkout)
     * Cria um pedido via API
     */
    async function checkout() {
        try {
            // Verifica se o carrinho está vazio
            if (items.value.length === 0) {
                showError('Carrinho Vazio', 'Adicione produtos ao carrinho antes de finalizar a compra.')
                return false
            }

            // Confirmação antes de finalizar
            const totalMessage = discountValue.value > 0
                ? `R$ ${totalPriceWithDiscount.value.toFixed(2)} (desconto de R$ ${discountValue.value.toFixed(2)} aplicado)`
                : `R$ ${totalPrice.value.toFixed(2)}`

            const result = await showConfirm(
                'Finalizar Compra',
                `Confirma a compra de ${totalItems.value} item(ns) por ${totalMessage}?`,
                'Sim, finalizar',
                'Cancelar'
            )

            if (result.isConfirmed) {
                // Mostra loading durante o processamento
                showLoading('Processando pedido...')

                try {
                    // Prepara os dados do pedido no formato esperado pela API
                    const finalTotal = totalPriceWithDiscount.value
                    const orderData = {
                        OrderItems: items.value.map(item => ({
                            ProductId: item.id,
                            Quantity: item.quantity
                        })),
                        Date: new Date().toISOString()
                    }

                    // Faz o POST para criar o pedido
                    const createdOrder = await createOrder(orderData)

                    // Fecha o loading
                    closeLoading()

                    // Mostra mensagem de sucesso
                    const totalMessage = discountValue.value > 0
                        ? `Total: R$ ${finalTotal.toFixed(2)} (Desconto: R$ ${discountValue.value.toFixed(2)})`
                        : `Total: R$ ${finalTotal.toFixed(2)}`

                    showSuccess(
                        'Compra Finalizada!',
                        `Seu pedido foi criado com sucesso. ${totalMessage}`
                    )

                    // Limpa o carrinho após a compra
                    clearCart()
                    return true
                } catch (apiError) {
                    // Fecha o loading em caso de erro
                    closeLoading()

                    // Trata erros específicos da API
                    let errorMessage = 'Não foi possível criar o pedido. Tente novamente.'

                    if (apiError.response?.status === 401) {
                        errorMessage = 'É necessário estar autenticado para finalizar a compra. Por favor, faça login primeiro.'
                    } else if (apiError.response?.status === 403) {
                        errorMessage = 'Você não tem permissão para realizar esta ação.'
                    } else if (apiError.response?.status >= 500) {
                        errorMessage = 'Erro no servidor. Tente novamente mais tarde.'
                    } else if (apiError.response?.data?.message) {
                        errorMessage = apiError.response.data.message
                    } else if (apiError.message) {
                        errorMessage = apiError.message
                    }

                    showError('Erro ao processar pedido', errorMessage)
                    return false
                }
            }

            return false
        } catch (error) {
            showError('Erro', 'Não foi possível finalizar a compra.')
            return false
        }
    }

    // Retorna tudo que será exposto pela store
    return {
        items,
        totalItems,
        totalPrice,
        totalPriceWithDiscount,
        isEmpty,
        appliedCoupon,
        discountValue,
        shippingPrice,
        shippingAddress,
        shippingCep,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        calculateShipping,
        removeShipping,
        checkout
    }
})

