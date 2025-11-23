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
    // Atualiza o token se estiver perto de expirar
    await keycloak.updateToken(30)
    config.headers.Authorization = `Bearer ${keycloak.token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default api;
