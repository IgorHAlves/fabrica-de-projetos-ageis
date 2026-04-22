import api from './Axios';

export async function getCategories() {
    try {
        const response = await api.get('Category');
        // A API retorna {items: Array, actualPage: 1, totalItens: 2, totalPages: 1}
        // Extrair o array 'items' que contém as categorias
        const categories = response.data?.items || [];
        return categories;
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return [];
    }
}


export async function getCategoriesList() {
    try {
        const response = await api.get('Category');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
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
