import api from './Axios';

/**
 * Busca todas as categorias
 * @returns {Promise<Array>} Lista de categorias
 */
export async function getCategories() {
    try {
        const response = await api.get('Category');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
    }
}

/**
 * Cria uma nova categoria
 * @param {Object} categoryData - Dados da categoria { name, description }
 * @returns {Promise<Object>} Categoria criada
 */
export async function createCategory(categoryData) {
    try {
        const response = await api.post('Category', categoryData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
    }
}

/**
 * Atualiza uma categoria existente
 * @param {String|Number} id - ID da categoria
 * @param {Object} categoryData - Dados atualizados { name, description }
 * @returns {Promise<Object>} Categoria atualizada
 */
export async function updateCategory(id, categoryData) {
    try {
        const response = await api.put(`Category/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
    }
}

/**
 * Deleta uma categoria
 * @param {String|Number} id - ID da categoria
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
    try {
        await api.delete(`Category/${id}`);
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
    }
}
