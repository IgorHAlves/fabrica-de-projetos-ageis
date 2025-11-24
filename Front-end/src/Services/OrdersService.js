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

