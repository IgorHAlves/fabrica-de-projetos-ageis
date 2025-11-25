import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import keycloak from './Keycloak'

const app = createApp(App)

window._keycloak = keycloak
app.config.globalProperties.$keycloak = keycloak

keycloak.init({ onLoad: 'check-sso' })
    .then(authenticated => {
        console.log(authenticated ? 'Usuário autenticado' : 'Usuário anônimo')

        app.use(createPinia())
        app.use(router)
        app.mount('#app')
    })
    .catch(err => {
        console.error('Erro ao inicializar Keycloak', err)
    })
