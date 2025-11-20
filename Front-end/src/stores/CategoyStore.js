import { defineStore } from 'pinia'
import { createCategory, getCategoriesList } from '@/Services/CategoriesService'

export const useCategorysStore = defineStore('categories', {
    state: () => ({
        items: [],
        searchName: '',
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        loading: false,
        name: '',
        description: ''
    }),

    actions: {
        async fetchCategories() {
            this.loading = true
            const data = await getCategoriesList()
            this.items = data.items
            this.totalPages = data.totalPages
            this.loading = false
        },

        setSearchName(name) {
            this.searchName = name
        },

        async createCategory() {
            const categoryData = {
                name: this.name,
                description: this.description
            }
            const id = await createCategory(categoryData)
            console.log(id);
        }
    }
})
