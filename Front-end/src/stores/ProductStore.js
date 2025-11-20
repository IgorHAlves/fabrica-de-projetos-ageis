import { defineStore } from 'pinia'
import { getProducts } from '../Services/ProductsService'

export const useProductsStore = defineStore('productsNew', {
    state: () => ({
        items: [],
        searchName: '',
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        loading: false
    }),

    actions: {
        async fetchProducts() {
            this.loading = true
            const data = await getProducts(this.pageNumber, this.pageSize, this.searchName)
            this.items = data.items
            this.totalPages = data.totalPages
            this.loading = false
        },

        setSearchName(name) {
            this.searchName = name
        }
    }
})
