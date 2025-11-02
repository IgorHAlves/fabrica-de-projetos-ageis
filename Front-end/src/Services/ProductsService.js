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
    // Re-lança o erro para ser tratado no componente
    // O erro será tratado no useProductForm com mensagem específica
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
    // Erro já é tratado pelo service
    return null;
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

/**
 * Atualiza o estoque de um produto após compra
 * @param {Number} productId - ID do produto
 * @param {Number} quantity - Quantidade comprada (será subtraída do estoque)
 * @returns {Promise<Object>} Produto atualizado
 */
export async function updateProductStock(productId, quantity) {
  let product = null
  try {
    // Busca o produto atual
    product = await getProductById(productId)
    if (!product) {
      throw new Error(`Produto ${productId} não encontrado`)
    }

    // Calcula novo estoque (subtract quantity from stock)
    const newStock = Math.max(0, (product.stock || 0) - quantity)

    // Log do produto completo para debug
    if (import.meta.env.DEV) {
      console.log('Produto recebido da API:', {
        id: product.id,
        name: product.name,
        fullProduct: product,
        keys: Object.keys(product)
      })
    }

    // Garante que CategoryId esteja presente e seja um número válido
    // Tenta diferentes formatos de nome do campo (case-insensitive)
    let categoryId = null

    // Tenta encontrar CategoryId em diferentes formatos
    const possibleKeys = ['CategoryId', 'categoryId', 'category', 'idCategory', 'Category', 'CATEGORY_ID']
    for (const key of possibleKeys) {
      if (product.hasOwnProperty(key) && product[key] !== null && product[key] !== undefined) {
        categoryId = product[key]
        break
      }
    }

    // Se ainda não encontrou, tenta em objeto category aninhado
    if (!categoryId && product.category) {
      if (typeof product.category === 'object' && product.category !== null) {
        categoryId = product.category.id || product.category.Id || product.category.categoryId
      } else if (typeof product.category === 'number') {
        categoryId = product.category
      } else if (typeof product.category === 'string' && !isNaN(product.category)) {
        categoryId = parseInt(product.category, 10)
      }
    }

    // Valida o CategoryId (pode ser número ou UUID/string)
    let validCategoryId = null

    if (categoryId !== null && categoryId !== undefined) {
      // Se for número, valida que é positivo
      const categoryIdNum = Number(categoryId)
      if (!isNaN(categoryIdNum) && categoryIdNum > 0) {
        validCategoryId = categoryIdNum
      }
      // Se for string (UUID ou outro formato), aceita se não estiver vazio
      else if (typeof categoryId === 'string' && categoryId.trim().length > 0) {
        validCategoryId = categoryId.trim()
      }
      // Se for objeto com id, extrai o id
      else if (typeof categoryId === 'object' && categoryId !== null && categoryId.id) {
        const extractedId = categoryId.id
        const extractedNum = Number(extractedId)
        if (!isNaN(extractedNum) && extractedNum > 0) {
          validCategoryId = extractedNum
        } else if (typeof extractedId === 'string' && extractedId.trim().length > 0) {
          validCategoryId = extractedId.trim()
        }
      }
    }

    if (!validCategoryId) {
      // Log mais detalhado em desenvolvimento
      if (import.meta.env.DEV) {
        console.error('Categoria não encontrada no produto:', {
          productId,
          productName: product.name,
          categoryIdRaw: categoryId,
          categoryIdType: typeof categoryId,
          productKeys: Object.keys(product),
          productCategory: product.category
        })
      }
      throw new Error(`Produto ${productId} ("${product.name || 'sem nome'}") não tem uma categoria válida. O campo CategoryId não foi encontrado no produto. Não é possível atualizar o estoque.`)
    }

    // Usa o ID validado (pode ser número ou string/UUID)
    categoryId = validCategoryId

    // Verifica se a categoria existe antes de tentar atualizar (opcional - pode falhar se for UUID)
    // Se categoryId for UUID, pode não conseguir verificar, mas ainda tenta atualizar
    try {
      const { getCategoryById } = await import('./CategoriesService')
      const category = await getCategoryById(categoryId)

      if (!category || !category.id) {
        if (import.meta.env.DEV) {
          console.warn(`A categoria ${categoryId} do produto "${product.name || productId}" não foi encontrada na verificação prévia, mas tentando atualizar mesmo assim.`)
        }
        // Não bloqueia - continua tentando atualizar
      }
    } catch (categoryError) {
      // Se não conseguir verificar a categoria, tenta mesmo assim mas com erro mais claro
      if (import.meta.env.DEV) {
        console.warn(`Não foi possível verificar a categoria ${categoryId} para o produto ${productId}:`, categoryError)
      }
      // Continua tentando atualizar, mas se falhar será tratado no catch abaixo
    }

    // Monta o objeto de atualização com todos os campos necessários
    // IMPORTANTE: Usa apenas os campos que vêm do produto original
    // NOTA: Para atualização, verificar se o backend espera IdCategory ou CategoryId
    // Por enquanto mantém CategoryId para compatibilidade, mas pode precisar ser IdCategory
    const updateData = {
      id: product.id || productId,
      name: product.name || '',
      description: product.description !== undefined ? product.description : null,
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl !== undefined ? product.imageUrl : null,
      stock: newStock,
      idPai: product.idPai !== undefined ? product.idPai : null,
      // CategoryId pode ser número ou UUID (string) - já validado acima
      // NOTA: Verificar se UpdateProductDTO usa CategoryId ou IdCategory
      CategoryId: categoryId
    }

    // Log em desenvolvimento para debug
    if (import.meta.env.DEV) {
      console.log(`Atualizando estoque do produto ${productId}:`, {
        productName: product.name,
        oldStock: product.stock,
        newStock: newStock,
        quantity: quantity,
        categoryId: updateData.CategoryId
      })
    }

    // Atualiza o produto no backend
    const response = await api.put(`Product/${productId}`, updateData)

    return response.data
  } catch (error) {
    // Trata erros de foreign key constraint de forma mais clara
    const errorMessage = error.message || ''
    const errorResponse = error.response?.data
    let fullError = errorMessage

    if (errorResponse) {
      if (typeof errorResponse === 'string') {
        fullError += ' ' + errorResponse
      } else if (errorResponse.message) {
        fullError += ' ' + errorResponse.message
      } else {
        fullError += ' ' + JSON.stringify(errorResponse)
      }
    }

    const lowerError = fullError.toLowerCase()

    // Se for erro de foreign key, fornece mensagem mais clara
    if (lowerError.includes('foreign key') ||
      lowerError.includes('fk_products_categories') ||
      lowerError.includes('cannot add or update')) {
      throw new Error(`Erro de foreign key: A categoria do produto "${product?.name || productId}" não existe mais no banco de dados. Por favor, remova este produto do carrinho ou contate o suporte.`)
    }

    // Em caso de erro, apenas loga em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Erro ao atualizar estoque:', error)
      console.error('Dados do produto:', { productId, quantity, product })
    }

    throw error
  }
}



