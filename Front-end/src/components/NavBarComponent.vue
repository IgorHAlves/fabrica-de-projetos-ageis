<template>
    <nav class="flex justify-between items-center p-4 bg-white shadow border-b mt-2 shadow hover:shadow-lg transition">

        <!-- Logo -->
        <div class="flex items-center gap-4">
            <h1 class="text-4xl md:text-2xl font-extrabold tracking-wide text-gray-900">
                CLOTHING <span class="text-indigo-600">E-COMMERCE</span>
            </h1>
        </div>

        <!-- Barra de pesquisa com histórico -->
        <form @submit.prevent="handleSearch" class="flex-1 max-w-md mx-4">
            <div class="relative" @focusout="hideHistory" @focusin="showHistoryIfHasData">
                <!-- Input de busca -->
                <input type="text" v-model="searchQuery" placeholder="Buscar produtos..." class="w-full border border-gray-300 rounded-full py-2.5 px-4 pl-12 pr-10 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           transition-all duration-200 text-gray-700 placeholder-gray-400" @input="handleSearchInput"
                    @keydown.enter.prevent="handleSearch" @focus="showHistoryIfHasData" aria-label="Buscar produtos"
                    autocomplete="off" />

                <!-- Ícone de busca (Font Awesome) -->
                <span class="absolute inset-y-0 left-0 flex items-center pl-4">
                    <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
                </span>

                <!-- Botão de limpar busca (aparece quando há texto) -->
                <button v-if="searchQuery" type="button" @click="clearSearch"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Limpar busca" aria-label="Limpar busca">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <!-- Dropdown de histórico de buscas -->
                <div v-if="showSearchHistory && searchHistory.history.value.length > 0"
                    class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div class="p-2 border-b border-gray-200 flex justify-between items-center">
                        <span class="text-xs font-semibold text-gray-600">Buscas recentes</span>
                        <button @click.stop="searchHistory.clearHistory()"
                            class="text-xs text-gray-400 hover:text-gray-600" aria-label="Limpar histórico">
                            Limpar
                        </button>
                    </div>
                    <div class="py-1">
                        <div v-for="(term, index) in searchHistory.history.value" :key="index"
                            @click.stop="selectHistoryTerm(term)"
                            class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between group cursor-pointer"
                            :aria-label="`Buscar por ${term}`"
                            role="button"
                            tabindex="0"
                            @keydown.enter="selectHistoryTerm(term)">
                            <span class="text-gray-700">{{ term }}</span>
                            <button @click.stop="searchHistory.removeFromHistory(term)"
                                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                                aria-label="Remover do histórico"
                                type="button">
                                <i class="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="flex justify-center">
            <!-- Link para o carrinho com indicador de quantidade -->
            <router-link to="/carrinho"
                class="relative inline-flex justify-center items-center gap-2 m-1 py-2 px-2 text-sm bg-black text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-gray-700"
                aria-label="Carrinho de compras">

                <!-- Ícone do carrinho usando Font Awesome -->
                <i class="fa-solid fa-cart-shopping text-xl"></i>

                <!-- Badge com quantidade de itens no carrinho -->
                <span v-if="totalItems > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {{ totalItems > 99 ? '99+' : totalItems }}
                </span>
            </router-link>








            <button type="button" data-target="dropdown-with-icon"
                class="dropdown-toggle inline-flex justify-center items-center gap-2 py-1 m-1 px-4 text-sm bg-black text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-gray-700 hover:text">


                Login


                <!-- <svg class="dropdown-open:rotate-180 w-2.5 h-2.5 text-white" width="16" height="16" viewBox="0 0 16 16"


          fill="none" xmlns="http://www.w3.org/2000/svg">


          <path d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5" stroke="currentColor"


            stroke-width="2" stroke-linecap="round"></path>


        </svg> -->


            </button>




        </div>
    </nav>

    <!-- Barra(rotas) -->
    <nav
        class="flex justify-center gap-8 items-center p-4 bg-white shadow font-semibold border-b mt-2 shadow hover:shadow-lg transition">
        <ul class="flex gap-14 items-center">
            <li>
                <RouterLink to="/" class="hover:text-blue-500">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/produtos" class="hover:text-blue-500">Produtos</RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/produtos/novo" class="hover:text-blue-500">Cadastrar Produto</RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/cupons" class="hover:text-blue-500">
                    <i class="fa-solid fa-ticket mr-1"></i>
                    Gerenciar Cupons
                </RouterLink>
            </li>
            <li><a href="/about" class="hover:text-blue-500">Sobre</a></li>
        </ul>
    </nav>
</template>
<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useDebounce } from '../composables/useDebounce'
import { useSearchHistory } from '../composables/useSearchHistory'

// Acessa a quantidade total de itens no carrinho
const { totalItems } = useCart()

// Router e Route para navegação
const router = useRouter()
const route = useRoute()

// Histórico de buscas
const searchHistory = useSearchHistory()
const showSearchHistory = ref(false)

// Estado da busca - sincroniza com query parameter
const searchQuery = ref(route.query.search || '')

/**
 * Mostra histórico se houver dados
 */
function showHistoryIfHasData() {
    if (searchHistory.history.value.length > 0) {
        showSearchHistory.value = true
    }
}

/**
 * Esconde histórico
 */
function hideHistory() {
    // Pequeno delay para permitir clique nos itens
    setTimeout(() => {
        showSearchHistory.value = false
    }, 200)
}

/**
 * Seleciona termo do histórico
 */
function selectHistoryTerm(term) {
    searchQuery.value = term
    handleSearch()
    showSearchHistory.value = false
}

// Sincroniza o input quando a rota mudar
watch(() => route.query.search, (newSearch) => {
    searchQuery.value = newSearch || ''
})

// Função para navegar com busca (com debounce)
const navigateWithSearch = useDebounce((term) => {
    if (term && term.trim()) {
        router.push({
            path: '/produtos',
            query: { search: term.trim() }
        })
        // Adiciona ao histórico
        searchHistory.addToHistory(term.trim())
    } else {
        router.push('/produtos')
    }
}, 500)

/**
 * Handler para quando o usuário digita na busca
 * Aplica debounce para melhorar performance
 */
function handleSearchInput() {
    // Se o campo ficar vazio, navega imediatamente
    if (!searchQuery.value.trim()) {
        if (route.path === '/produtos') {
            router.push('/produtos')
        }
        return
    }

    // Aplica debounce na navegação
    navigateWithSearch(searchQuery.value)
}

/**
 * Handler para submit do formulário de busca
 * Navega imediatamente sem debounce
 */
function handleSearch() {
    if (searchQuery.value.trim()) {
        // Navega para produtos com query parameter
        router.push({
            path: '/produtos',
            query: { search: searchQuery.value.trim() }
        })
        // Adiciona ao histórico
        searchHistory.addToHistory(searchQuery.value.trim())
    }
}

/**
 * Limpa a busca e navega para produtos sem filtro
 */
function clearSearch() {
    searchQuery.value = ''
    router.push('/produtos')
}
</script>
