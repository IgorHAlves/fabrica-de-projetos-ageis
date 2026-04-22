import { ref } from 'vue'

// Chave para armazenar histórico de buscas
const SEARCH_HISTORY_KEY = 'fabrica-search-history'
const MAX_HISTORY_ITEMS = 10

/**
 * Composable para gerenciar histórico de buscas
 */
export function useSearchHistory() {
    // Carrega histórico do localStorage
    const loadHistory = () => {
        try {
            const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                return Array.isArray(parsed) ? parsed : []
            }
        } catch (error) {
            // Em caso de erro, retorna array vazio
        }
        return []
    }

    // Estado reativo do histórico
    const history = ref(loadHistory())

    /**
     * Adiciona uma busca ao histórico
     * @param {String} searchTerm - Termo de busca
     */
    const addToHistory = (searchTerm) => {
        if (!searchTerm || !searchTerm.trim()) return

        const term = searchTerm.trim().toLowerCase()

        // Remove duplicatas
        history.value = history.value.filter(item => item.toLowerCase() !== term)

        // Adiciona no início
        history.value.unshift(searchTerm.trim())

        // Limita o tamanho do histórico
        if (history.value.length > MAX_HISTORY_ITEMS) {
            history.value = history.value.slice(0, MAX_HISTORY_ITEMS)
        }

        // Salva no localStorage
        try {
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.value))
        } catch (error) {
            // Ignora erros de localStorage
        }
    }

    /**
     * Remove um item do histórico
     * @param {String} searchTerm - Termo a ser removido
     */
    const removeFromHistory = (searchTerm) => {
        history.value = history.value.filter(item => item !== searchTerm)

        // Salva no localStorage
        try {
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.value))
        } catch (error) {
            // Ignora erros de localStorage
        }
    }

    /**
     * Limpa todo o histórico
     */
    const clearHistory = () => {
        history.value = []
        try {
            localStorage.removeItem(SEARCH_HISTORY_KEY)
        } catch (error) {
            // Ignora erros de localStorage
        }
    }

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory
    }
}
