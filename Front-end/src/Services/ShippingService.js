import api from './Axios';

/**
 * Busca informações de frete pelo CEP
 * @param {String} cep - CEP para calcular o frete (formato: 12345678 ou 12345-678)
 * @returns {Promise<Object>} Dados do endereço e valor do frete { address, shippingRate }
 */
export async function getShipping(cep) {
    try {
        // Remove formatação do CEP (remove hífen e espaços)
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            throw new Error('CEP deve conter 8 dígitos');
        }

        const response = await api.get(`Shipping/${cleanCep}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar frete:', error);
        throw error;
    }
}


