import api from './Axios';

/**
 * Busca todas as categorias da API
 * @returns {Promise<Array>} Array de categorias ou array vazio em caso de erro
 */
export async function getCategories() {
    try {
        // Faz a requisição GET para buscar categorias
        const response = await api.get('Category');

        // A API retorna {items: Array, actualPage: 1, totalItens: 2, totalPages: 1}
        // Precisamos extrair o array 'items' que contém as categorias
        const categories = response.data?.items || response.data || [];

        return categories;
    } catch (error) {
        // Retorna array vazio em caso de erro para não quebrar a aplicação
        // Loga erro apenas em desenvolvimento
        if (import.meta.env.DEV && error.code !== 'ERR_NETWORK') {
            console.error('Erro ao buscar categorias:', error);
        }
        return [];
    }
}

export async function createCategory(categoryData) {
    try {
        const response = await api.post('Category', categoryData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
    }
}

export async function getCategoryById(id) {
    try {
        const response = await api.get(`Category/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar categoria por ID:', error);
        throw error;
    }
}

export async function updateCategory(id, categoryData) {
    try {
        const response = await api.put(`Category/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
    }
}

export async function deleteCategory(id) {
    try {
        const response = await api.delete(`Category/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
    }
}
