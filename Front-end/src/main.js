import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import keycloak from './Keycloak'
import router from './router'

const app = createApp(App)

window._keycloak = keycloak
app.config.globalProperties.$keycloak = keycloak

keycloak.init({ onLoad: 'check-sso' })
    .then(authenticated => {


        app.use(createPinia())
        app.use(router)
        app.mount('#app')
    })
    .catch(err => {
        console.error('Erro ao inicializar Keycloak', err)
    })
