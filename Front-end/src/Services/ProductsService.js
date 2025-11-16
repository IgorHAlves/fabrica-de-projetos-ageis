import api from './Axios';


export async function getProducts(pageNumber = 1, pageSize = 12, name = '') {
  try {
    const params = { pageNumber, pageSize }
    if (name) params.name = name

    const response = await api.get('Product', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return { items: [], totalPages: 0 }
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



