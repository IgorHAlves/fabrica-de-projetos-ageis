<template>
    <nav class="flex justify-between items-center p-4 bg-white shadow border-b mt-2 shadow hover:shadow-lg transition">

        <!-- Logo -->
        <div class="flex items-center gap-4">
            <h1 class="text-4xl md:text-2xl font-extrabold tracking-wide text-gray-900">
                CLOTHING <span class="text-indigo-600">E-COMMERCE</span>
            </h1>
        </div>

        <!-- Barra de pesquisa -->
        <form class="flex-1 max-w-md mx-4" @submit.prevent="search()">
            <div class="relative text-gray-600 focus-within:text-gray-400">
                <input type="text" v-model="searchText" placeholder="Buscar produtos..." class="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 
                 focus:outline-none focus:ring-2 focus:ring-gray-500" />
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
            </div>
        </form>

        <div class="flex justify-center items-center">
            <router-link to="/carrinho"
                class="ml-6 items-center gap-2 p-1 rounded-full border-2 border-black bg-gray-600 hover:bg-gray-800 shadow text-white transition duration-200 justify-center items-center inline-flex duration-300 hover:shadow-[0_0_24px_black]">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 64 64" fill="none">
                    <path d="M16 16h4l6 24h20l4-16H26" stroke="white" stroke-width="2" fill="none" />
                    <circle cx="26" cy="48" r="4" fill="white" />
                    <circle cx="44" cy="48" r="4" fill="white" />
                </svg>
            </router-link>


            <div class="relative inline-block group ml-4">
                <button
                    class="ml-6 flex items-center gap-2 p-3 rounded-full border border-gray-800 border-2 bg-gray-600 hover:bg-blue-800 shadow mr-20 text-white transition duration-300 hover:shadow-[0_0_24px_blue]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                    </svg>
                </button>

                <div
                    class="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 border border-blue-600 font-bold transition-all duration-200">
                    <div
    class="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 border border-blue-600 font-bold transition-all duration-200">
    
    <button 
        @click="login"
        class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400">
        Login
    </button>

    <button 
        @click="logout"
        class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400">
        Sair
    </button>
</div>

                </div>
            </div>


        </div>
    </nav>

    <!-- Barra(rotas) -->
    <nav
        class="flex justify-center gap-8 items-center p-4 bg-white shadow font-semibold border-b mt-2 shadow hover:shadow-lg transition">
        <ul class="flex gap-14 items-center">
            <li>
                <RouterLink to="/home" class="hover:text-blue-500">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/categorias" class="hover:text-blue-500">Categoria</RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/categorias/nova" class="hover:text-blue-500">Cadastrar Categoria</RouterLink>
            </li>
            <li>
                <RouterLink to="/produtos" class="hover:text-blue-500">Produtos</RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/produtos/novo" class="hover:text-blue-500">Cadastrar Produto</RouterLink>
            </li>
            <li>
                <RouterLink to="/sobre" class="hover:text-blue-500">Sobre</RouterLink>
            </li>
        </ul>
    </nav>

</template>

<script setup>
import { routeLocationKey, RouterLink, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/ProductStore';
import { ref } from 'vue';
import { getCurrentInstance } from 'vue'

const searchText = ref('')
const store = useProductsStore()
const router = useRouter()

function search(){
    store.setSearchName(searchText.value)

    if (router.currentRoute.value.name != 'produtos'){
        router.push({name:'produtos'})
    }

    store.pageNumber = 1
    store.fetchProducts()
}

//keycloak
const { appContext } = getCurrentInstance()
const keycloak = appContext.config.globalProperties.$keycloak

const login = () => {
  keycloak.login({ redirectUri: window.location.origin })
}

const logout = () => {
  keycloak.logout({ redirectUri: window.location.origin })
}

</script>
