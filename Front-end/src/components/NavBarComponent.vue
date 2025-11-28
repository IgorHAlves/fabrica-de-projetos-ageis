<template>
    <nav class="flex justify-between items-center p-4 bg-white shadow border-b mt-2">
        <!-- Logo -->
        <div class="flex items-center gap-4">
            <h1 class="text-4xl md:text-2xl font-extrabold tracking-wide text-gray-900">
                CLOTHING <span class="text-indigo-600">E-COMMERCE</span>
            </h1>
        </div>

        <!-- Barra de pesquisa -->
        <form class="flex-1 max-w-md mx-4" @submit.prevent="search()">
            <div class="relative text-gray-600 focus-within:text-gray-400">
                <input type="text" v-model="searchText" placeholder="Buscar produtos..." 
                    class="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-500" />
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
            </div>
        </form>

        <!-- Ícones de ação -->
        <div class="flex items-center gap-4">
            <!-- Ícone do Carrinho -->
            <router-link to="/carrinho" class="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                <i class="fa-solid fa-shopping-cart text-gray-700 text-xl"></i>
                <span v-if="cartStore.totalItems > 0" 
                    class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {{ cartStore.totalItems }}
                </span>
            </router-link>

            <!-- Ícone de Perfil -->
            <div class="relative group">
                <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                    <i class="fa-solid fa-user text-gray-700 text-xl"></i>
                </button>

                <!-- Dropdown Menu -->
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <!-- Se estiver logado -->
                    <div v-if="keycloak.authenticated">
                        <div class="px-4 py-3 border-b border-gray-200">
                            <p class="text-sm font-semibold text-gray-900">{{ keycloak.tokenParsed?.name || 'Usuário' }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ keycloak.tokenParsed?.email || '' }}</p>
                        </div>
                        <router-link to="/meus-pedidos" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                            <i class="fa-solid fa-box mr-2"></i> Meus Pedidos
                        </router-link>
                        <router-link v-if="isAdmin" to="/admin/dashboard" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                            <i class="fa-solid fa-shield-halved mr-2"></i> Painel Admin
                        </router-link>
                        <button 
                            @click="logout"
                            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition rounded-b-lg">
                            <i class="fa-solid fa-right-from-bracket mr-2"></i> Sair
                        </button>
                    </div>

                    <!-- Se NÃO estiver logado -->
                    <div v-else>
                        <button 
                            @click="login"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition rounded-lg">
                            <i class="fa-solid fa-right-to-bracket mr-2"></i> Entrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Barra de navegação -->
    <nav class="flex justify-center gap-8 items-center p-4 bg-white shadow font-semibold border-b mt-2">
        <ul class="flex gap-14 items-center">
            <!-- Home -->
            <li>
                <RouterLink to="/home" class="hover:text-blue-500">Home</RouterLink>
            </li>
            
            <!-- Produtos -->
            <li>
                <RouterLink to="/produtos" class="hover:text-blue-500">Produtos</RouterLink>
            </li>
            
            <!-- Sobre -->
            <li>
                <RouterLink to="/sobre" class="hover:text-blue-500">Sobre</RouterLink>
            </li>
            

        </ul>
    </nav>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { getCurrentInstance, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const searchText = ref('')
const store = useProductsStore()
const cartStore = useCartStore()
const router = useRouter()

// Auth
const { isAdmin } = useAuth()

function search() {
    // Atualiza a URL com o termo de busca
    // O ProductView vai reagir à mudança na rota
    router.push({ 
        name: 'produtos', 
        query: { search: searchText.value } 
    })
}

// Keycloak
const { appContext } = getCurrentInstance()
const keycloak = appContext.config.globalProperties.$keycloak

const login = () => {
    keycloak.login({ redirectUri: window.location.origin })
}

const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin })
}
</script>
