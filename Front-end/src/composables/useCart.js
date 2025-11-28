import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

/**
 * Composable para facilitar o uso da store do carrinho
 * Segue o padrão de outros composables do projeto
 */
export function useCart() {
    // Acessa a store do carrinho
    const cartStore = useCartStore()

    // Extrai os valores reativos da store usando storeToRefs
    // Isso garante que os valores sejam reativos nos componentes
    const { items, totalItems, totalPrice, totalPriceWithDiscount, isEmpty, appliedCoupon, discountValue, shippingPrice, shippingAddress, shippingCep } = storeToRefs(cartStore)

    /**
     * Adiciona produto ao carrinho
     * @param {Object} product - Produto a ser adicionado
     */
    const addToCart = (product) => {
        cartStore.addToCart(product)
    }

    /**
     * Remove produto do carrinho
     * @param {Number} productId - ID do produto
     */
    const removeFromCart = (productId) => {
        cartStore.removeFromCart(productId)
    }

    /**
     * Aumenta quantidade de um item
     * @param {Number} productId - ID do produto
     */
    const increaseQuantity = (productId) => {
        cartStore.increaseQuantity(productId)
    }

    /**
     * Diminui quantidade de um item
     * @param {Number} productId - ID do produto
     */
    const decreaseQuantity = (productId) => {
        cartStore.decreaseQuantity(productId)
    }

    /**
     * Limpa todo o carrinho
     */
    const clearCart = () => {
        cartStore.clearCart()
    }

    /**
     * Aplica um cupom ao carrinho
     * @param {Object} coupon - Cupom { code, value, categoryEnum }
     */
    const applyCoupon = (coupon) => {
        cartStore.applyCoupon(coupon)
    }

    /**
     * Remove o cupom aplicado
     */
    const removeCoupon = () => {
        cartStore.removeCoupon()
    }

    /**
     * Calcula o frete baseado no CEP
     * @param {String} cep - CEP para calcular o frete
     */
    const calculateShipping = async (cep) => {
        return await cartStore.calculateShipping(cep)
    }

    /**
     * Remove o frete calculado
     */
    const removeShipping = () => {
        cartStore.removeShipping()
    }

    /**
     * Finaliza a compra
     */
    const checkout = async () => {
        return await cartStore.checkout()
    }

    // Retorna tudo que o componente pode usar
    return {
        // Valores reativos
        items,
        totalItems,
        totalPrice,
        totalPriceWithDiscount,
        isEmpty,
        appliedCoupon,
        discountValue,
        shippingPrice,
        shippingAddress,
        shippingCep,
        // Métodos
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        calculateShipping,
        removeShipping,
        checkout
    }
}
