import { computed, ref } from 'vue'

/**
 * Estado global de autenticação (Keycloak)
 */
const keycloakInstance = ref(null)
const isAuthenticated = ref(false)
const currentUser = ref(null)

/**
 * Composable de autenticação integrado com Keycloak
 * Fornece funcionalidades de login, logout, verificação de roles
 */
export function useAuth() {
    // Inicializa a instância do Keycloak
    if (!keycloakInstance.value && window._keycloak) {
        keycloakInstance.value = window._keycloak
        isAuthenticated.value = window._keycloak.authenticated || false

        if (isAuthenticated.value && window._keycloak.tokenParsed) {
            currentUser.value = {
                id: window._keycloak.tokenParsed.sub,
                name: window._keycloak.tokenParsed.name || window._keycloak.tokenParsed.preferred_username,
                email: window._keycloak.tokenParsed.email,
                roles: window._keycloak.tokenParsed.realm_access?.roles || []
            }
        }
    }

    /**
     * Verifica se o usuário está autenticado
     */
    const isLoggedIn = computed(() => isAuthenticated.value)

    /**
     * Verifica se o usuário é administrador
     */
    const isAdmin = computed(() => {
        if (!isAuthenticated.value || !currentUser.value) return false
        return currentUser.value.roles.includes('admin')
    })

    /**
     * Verifica se o usuário é cliente
     */
    const isCustomer = computed(() => {
        if (!isAuthenticated.value || !currentUser.value) return false
        return currentUser.value.roles.includes('customer')
    })

    /**
     * Retorna o usuário atual
     */
    const user = computed(() => currentUser.value)

    /**
     * Retorna o token atual do Keycloak
     */
    const token = computed(() => keycloakInstance.value?.token || null)

    /**
     * Redireciona para a página de login do Keycloak
     */
    async function login() {
        if (keycloakInstance.value) {
            await keycloakInstance.value.login()
        } else {
            console.error('Keycloak não inicializado')
        }
    }

    /**
     * Faz logout do usuário
     */
    async function logout() {
        if (keycloakInstance.value) {
            await keycloakInstance.value.logout()
            isAuthenticated.value = false
            currentUser.value = null
        }
    }

    /**
     * Verifica se o usuário tem determinada role
     * @param {string} roleName - Nome da role (ex: 'admin', 'customer')
     */
    function hasRole(roleName) {
        if (!isAuthenticated.value || !currentUser.value) return false
        return currentUser.value.roles.includes(roleName)
    }

    /**
     * Verifica se o usuário tem alguma das roles especificadas
     * @param {Array<string>} roles - Array de roles
     */
    function hasAnyRole(roles) {
        if (!isAuthenticated.value || !currentUser.value) return false
        return roles.some(role => currentUser.value.roles.includes(role))
    }

    /**
     * Verifica permissão do usuário
     * @param {string} permission - Permissão necessária ('admin', 'customer')
     */
    function hasPermission(permission) {
        if (!isAuthenticated.value) return false
        if (permission === 'admin') return isAdmin.value
        if (permission === 'customer') return isCustomer.value || isAdmin.value
        return true
    }

    /**
     * Atualiza o token se estiver perto de expirar
     * @param {number} minValidity - Tempo mínimo de validade em segundos (padrão: 30)
     */
    async function updateToken(minValidity = 30) {
        if (keycloakInstance.value) {
            try {
                const refreshed = await keycloakInstance.value.updateToken(minValidity)
                if (refreshed) {

                }
                return refreshed
            } catch (error) {
                console.error('Erro ao atualizar token:', error)
                throw error
            }
        }
        return false
    }

    /**
     * Atualiza os dados do usuário atual
     */
    function refreshUserData() {
        if (keycloakInstance.value && keycloakInstance.value.authenticated && keycloakInstance.value.tokenParsed) {
            isAuthenticated.value = true
            currentUser.value = {
                id: keycloakInstance.value.tokenParsed.sub,
                name: keycloakInstance.value.tokenParsed.name || keycloakInstance.value.tokenParsed.preferred_username,
                email: keycloakInstance.value.tokenParsed.email,
                roles: keycloakInstance.value.tokenParsed.realm_access?.roles || []
            }
        } else {
            isAuthenticated.value = false
            currentUser.value = null
        }
    }

    return {
        // Estado
        user,
        isLoggedIn,
        isAdmin,
        isCustomer,
        isAuthenticated,
        token,

        // Métodos
        login,
        logout,
        hasRole,
        hasAnyRole,
        hasPermission,
        updateToken,
        refreshUserData
    }
}
