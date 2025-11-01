import api from './Axios';

/**
 * Busca produtos com paginação e opcionalmente com termo de busca
 * @param {Number} pageNumber - Número da página
 * @param {Number} pageSize - Tamanho da página
 * @param {String} searchTerm - Termo de busca (opcional)
 * @returns {Promise<Object>} Dados dos produtos com paginação
 */
export async function getProducts(pageNumber = 1, pageSize = 12, searchTerm = '') {
  try {
    // Parâmetros da requisição
    const params = { pageNumber, pageSize }
    
    // Adiciona termo de busca se fornecido
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm.trim()
    }

    const response = await api.get('Product', { params })
    return response.data
  } catch (error) {
    // Retorna estrutura vazia em caso de erro
    return { items: [], totalPages: 0, totalItems: 0 }
  }
}

export async function createProduct(productData) {
  try {
    const response = await api.post('Product', productData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await api.delete(`Product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}

export async function getProductById(productId) {
  try {
    const response = await api.get(`Product/${productId}`)
    return response.data;
  } catch (error) {
    console.error('Erro ao encontrar o Produto:', error);
  }


}



