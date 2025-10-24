import api from './Axios';

export async function getProducts(pageNumber = 1, pageSize = 12) {
  try {
    const response = await api.get('Product', { params: { pageNumber, pageSize } });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
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



