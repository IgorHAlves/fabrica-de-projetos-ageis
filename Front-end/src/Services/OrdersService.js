import api from './Axios';

/**
 * Cria um novo pedido
 * @param {Object} orderData - Dados do pedido (itens, total, etc)
 * @returns {Promise<Object>} Dados do pedido criado
 */
export async function createOrder(orderData) {
    try {
        const response = await api.post('Order', orderData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
}

/**
 * Lista todos os pedidos com paginação
 * @param {number} pageNumber - Número da página (padrão: 1)
 * @param {number} pageSize - Tamanho da página (padrão: 10)
 * @returns {Promise<Object>} Lista paginada de pedidos
 */
export async function getOrders(pageNumber = 1, pageSize = 10) {
    try {
        const response = await api.get('Order', {
            params: { pageNumber, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
    }
}

/**
 * Busca um pedido específico por ID
 * @param {string} orderId - ID do pedido (GUID)
 * @returns {Promise<Object>} Dados do pedido
 */
export async function getOrderById(orderId) {
    try {
        const response = await api.get(`Order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        throw error;
    }
}
