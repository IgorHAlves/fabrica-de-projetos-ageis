import api from './Axios';

export async function getCategories() {
    try {
        console.log('Fazendo requisição para:', api.defaults.baseURL + 'Category');
        const response = await api.get('Category');
        console.log('Resposta completa da API:', response);
        console.log('Dados da resposta:', response.data);

        // A API retorna {items: Array, actualPage: 1, totalItens: 2, totalPages: 1}
        // Precisamos extrair o array 'items' que contém as categorias
        const categories = response.data?.items || [];
        console.log('Categorias extraídas:', categories);
        return categories;
    } catch (error) {
        console.error('Erro detalhado ao buscar categorias:', error);
        console.error('Status do erro:', error.response?.status);
        console.error('Dados do erro:', error.response?.data);
        console.error('URL da requisição:', error.config?.url);
        return [];
    }
}

export async function getCategoriesList() {
    try {
        console.log('Fazendo requisição para:', api.defaults.baseURL + 'Category');
        const response = await api.get('Category');
        const categories = response;
        console.log('Categorias extraídas:', categories);
        return categories.data;
    } catch (error) {
        console.error('Erro detalhado ao buscar categorias:', error);
        console.error('Status do erro:', error.response?.status);
        console.error('Dados do erro:', error.response?.data);
        console.error('URL da requisição:', error.config?.url);
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
