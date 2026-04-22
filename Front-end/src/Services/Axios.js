import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7181/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(async (config) => {
    const keycloak = window._keycloak || null



    if (keycloak && keycloak.authenticated) {
        try {
            // Atualiza o token se estiver perto de expirar (30 segundos)
            const refreshed = await keycloak.updateToken(30)
            if (refreshed) {

            }

            if (keycloak.token) {
                config.headers.Authorization = `Bearer ${keycloak.token}`


                // 🔍 DEBUG TEMPORÁRIO - Verificar roles no token
                if (keycloak.tokenParsed) {

                }
            } else {
                console.error('❌ Keycloak autenticado mas token não disponível')
            }
        } catch (error) {
            console.error('Erro ao atualizar token Keycloak:', error)
            // Se falhar ao atualizar o token, tenta usar o token atual
            if (keycloak.token) {
                config.headers.Authorization = `Bearer ${keycloak.token}`

            }
        }
    } else {
        console.warn('⚠️ Requisição sem autenticação:', config.url)
    }

    return config
}, (error) => {
    console.error('Erro no interceptor de requisição:', error)
    return Promise.reject(error)
})

// Interceptor de resposta para lidar com erros de autenticação
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Se receber 401 e ainda não tentou renovar o token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const keycloak = window._keycloak

            if (keycloak && keycloak.authenticated) {
                try {

                    await keycloak.updateToken(-1) // Força renovação do token

                    if (keycloak.token) {
                        originalRequest.headers.Authorization = `Bearer ${keycloak.token}`

                        return api(originalRequest)
                    }
                } catch (refreshError) {
                    console.error('Erro ao renovar token após 401:', refreshError)
                    // Se falhar, redireciona para login
                    keycloak.login()
                }
            } else {
                console.warn('Não autenticado, redirecionando para login...')
                if (keycloak) {
                    keycloak.login()
                }
            }
        }

        return Promise.reject(error)
    }
)

export default api;
