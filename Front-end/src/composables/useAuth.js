import { computed, ref } from 'vue'

/**
 * Mock de usuário para desenvolvimento
 * Será substituído quando a autenticação real for implementada
 */
const mockUser = {
    id: 'mock-admin-id',
    name: 'Administrador',
    email: 'admin@ecommerce.com',
    role: 'admin', // 'admin' ou 'customer'
    keycloakId: null
}

// Estado global de autenticação (mock)
const currentUser = ref(mockUser)
const isAuthenticated = ref(true) // Temporariamente true para desenvolvimento

/**
 * Composable de autenticação
 * Preparado para integração futura com API real
 */
export function useAuth() {
    /**
     * Verifica se o usuário está autenticado
     */
    const isLoggedIn = computed(() => isAuthenticated.value)

    /**
     * Verifica se o usuário é administrador
     */
    const isAdmin = computed(() => {
        return currentUser.value?.role === 'admin'
    })

    /**
     * Retorna o usuário atual
     */
    const user = computed(() => currentUser.value)

    /**
     * Login (mock - preparado para API futura)
     * @param {Object} credentials - { email, password }
     */
    async function login(credentials) {
        // TODO: Implementar chamada real à API quando disponível
        // const response = await authService.login(credentials)

        console.log('Login mock:', credentials)
        currentUser.value = mockUser
        isAuthenticated.value = true

        return { success: true, user: mockUser }
    }

    /**
     * Logout (mock - preparado para API futura)
     */
    async function logout() {
        // TODO: Implementar chamada real à API quando disponível
        // await authService.logout()

        console.log('Logout mock')
        currentUser.value = null
        isAuthenticated.value = false

        return { success: true }
    }

    /**
     * Verifica permissão do usuário
     * @param {string} permission - Permissão necessária ('admin', 'customer')
     */
    function hasPermission(permission) {
        if (!isAuthenticated.value) return false
        if (permission === 'admin') return isAdmin.value
        return true // Qualquer usuário autenticado tem permissão 'customer'
    }

    /**
     * Atualiza o usuário atual (para quando a API estiver pronta)
     */
    function setUser(user) {
        currentUser.value = user
        isAuthenticated.value = !!user
    }

    return {
        // Estado
        user,
        isLoggedIn,
        isAdmin,
        isAuthenticated,

        // Métodos
        login,
        logout,
        hasPermission,
        setUser
    }
}
