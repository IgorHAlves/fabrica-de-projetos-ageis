import api from './Axios'

/**
 * Cria um novo pedido (Order)
 * @param {Object} orderData - Dados do pedido contendo os itens
 * @returns {Promise<Object>} Dados do pedido criado
 */
export async function createOrder(orderData) {
    try {
        const response = await api.post('Order', orderData)
        return response.data
    } catch (error) {
        // Re-lança o erro para ser tratado no componente/store
        throw error
    }
}

/**
 * Busca todos os pedidos
 * @returns {Promise<Array>} Lista de pedidos
 */
export async function getOrders() {
    try {
        const response = await api.get('Order')
        return response.data
    } catch (error) {
        // Retorna array vazio em caso de erro
        return []
    }
}

/**
 * Busca um pedido por ID
 * @param {String} orderId - ID do pedido
 * @returns {Promise<Object>} Dados do pedido
 */
export async function getOrderById(orderId) {
    try {
        const response = await api.get(`Order/${orderId}`)
        return response.data
    } catch (error) {
        return null
    }
}

