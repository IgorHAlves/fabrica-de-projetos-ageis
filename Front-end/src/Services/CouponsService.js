import api from './Axios';

/**
 * Busca cupons com paginação
 * @param {Number} pageNumber - Número da página
 * @param {Number} pageSize - Tamanho da página
 * @returns {Promise<Object>} Dados dos cupons com paginação
 */
export async function getCoupons(pageNumber = 1, pageSize = 10) {
    try {
        const response = await api.get('Coupon', {
            params: { pageNumber, pageSize }
        });

        // Normaliza a resposta para sempre usar camelCase
        // Suporta tanto PascalCase (Items) quanto camelCase (items)
        const data = response.data || {};
        if (data.Items && !data.items) {
            data.items = data.Items;
        }
        if (data.TotalItens !== undefined && data.totalItens === undefined) {
            data.totalItens = data.TotalItens;
        }
        if (data.TotalPages !== undefined && data.totalPages === undefined) {
            data.totalPages = data.TotalPages;
        }
        if (data.ActualPage !== undefined && data.actualPage === undefined) {
            data.actualPage = data.ActualPage;
        }

        return data;
    } catch (error) {
        console.error('Erro ao buscar cupons:', error);
        throw error;
    }
}

/**
 * Busca um cupom pelo código
 * @param {String} code - Código do cupom
 * @returns {Promise<Object>} Dados do cupom
 */
export async function getCouponByCode(code) {
    try {
        if (!code || !code.trim()) {
            throw new Error('Código do cupom é obrigatório');
        }

        const response = await api.get(`Coupon/${code.trim()}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cupom:', error);
        throw error;
    }
}

/**
 * Cria um novo cupom
 * @param {Object} couponData - Dados do cupom { code, value, categoryEnum }
 * @returns {Promise<Object>} Dados do cupom criado
 */
export async function createCoupon(couponData) {
    try {
        const response = await api.post('Coupon', couponData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar cupom:', error);
        throw error;
    }
}

/**
 * Deleta um cupom pelo código
 * @param {String} code - Código do cupom
 * @returns {Promise<void>}
 */
export async function deleteCoupon(code) {
    try {
        if (!code || !code.trim()) {
            throw new Error('Código do cupom é obrigatório');
        }

        await api.delete(`Coupon/${code.trim()}`);
    } catch (error) {
        console.error('Erro ao deletar cupom:', error);
        throw error;
    }
}

/**
 * Calcula o desconto baseado no cupom e valor total
 * @param {Object} coupon - Cupom { code, value, categoryEnum }
 * @param {Number} totalValue - Valor total da compra
 * @returns {Number} Valor do desconto
 */
export function calculateDiscount(coupon, totalValue) {
    if (!coupon || !totalValue) return 0;

    // categoryEnum: 1 = percentual, 2 = totalValue
    if (coupon.categoryEnum === 1 || coupon.categoryEnum === 'percentual') {
        // Desconto percentual
        return (totalValue * coupon.value) / 100;
    } else if (coupon.categoryEnum === 2 || coupon.categoryEnum === 'totalValue') {
        // Desconto em valor fixo
        return Math.min(coupon.value, totalValue); // Não pode ser maior que o total
    }

    return 0;
}
