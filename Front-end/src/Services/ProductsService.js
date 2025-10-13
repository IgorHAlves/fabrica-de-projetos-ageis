import api from './Axios';

export async function getProducts(skip = 0, take = 12) {
  try {
    const response = await api.get('Product', {params: { skip, take }});
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

