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
        const data = response.data || {}

        // Normalização PascalCase -> camelCase
        if (data.Items && !data.items) data.items = data.Items
        if (data.TotalCount !== undefined && data.totalCount === undefined) data.totalCount = data.TotalCount
        if (data.TotalPages !== undefined && data.totalPages === undefined) data.totalPages = data.TotalPages

        // Garante que os itens tenham propriedades em camelCase
        if (data.items && Array.isArray(data.items)) {
            data.items = data.items.map(item => {
                return {
                    ...item,
                    id: item.id || item.Id,
                    name: item.name || item.Name,
                    price: item.price || item.Price,
                    // API retorna Stock, mapeamos para stockQuantity e stock
                    stockQuantity: item.stockQuantity || item.StockQuantity || item.Stock || item.stock || 0,
                    stock: item.stock || item.Stock || 0,
                    description: item.description || item.Description,
                    imageUrl: item.imageUrl || item.ImageUrl,
                    idPai: item.idPai || item.IdPai || item.id_pai, // Importante para variações
                    variations: item.variations || item.Variations || []
                }
            })
        }

        return data
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
        if (!productId) {
            console.error('getProductById: ID do produto não fornecido')
            return null
        }

        if (import.meta.env.DEV) {

        }

        const response = await api.get(`Product/${productId}`)



        if (!response || !response.data) {
            console.warn(`[ProductsService] Resposta vazia para ${productId}`)
            return null
        }

        return response.data
    } catch (error) {
        console.error('Erro ao encontrar o Produto:', error)

        // Se for 404, retorna null (produto não encontrado)
        if (error.response?.status === 404) {
            if (import.meta.env.DEV) {
                console.warn('getProductById: Produto não encontrado (404):', productId)
            }
            return null
        }

        // Se for timeout, retorna null
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            console.error('getProductById: Timeout ao buscar produto:', productId)
            return null
        }

        if (import.meta.env.DEV) {
            console.error('Detalhes do erro:', {
                productId,
                status: error.response?.status,
                statusText: error.response?.statusText,
                message: error.message,
                code: error.code,
                data: error.response?.data
            })
        }
        return null
    }
}

/**
 * Busca todas as variações (produtos filhos) de um produto pai
 * @param {String|Guid} parentProductId - ID do produto pai
 * @returns {Promise<Array>} Array de variações do produto
 */
export async function getProductVariations(parentProductId) {
    try {
        // Busca todos os produtos e filtra os que têm idPai igual ao parentProductId
        const allProducts = await getProducts(1, 1000, '')
        if (!allProducts || !allProducts.items) {
            return []
        }

        // Filtra produtos que têm idPai igual ao produto pai
        const variations = allProducts.items.filter(product => {
            // Compara idPai em diferentes formatos (string, UUID, etc)
            const productIdPai = product.idPai || product.IdPai || product.id_pai
            const parentId = String(parentProductId).trim()

            if (!productIdPai) return false

            // Compara como string para garantir compatibilidade
            return String(productIdPai).trim() === parentId
        })

        return variations
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Erro ao buscar variações do produto:', error)
        }
        return []
    }
}



