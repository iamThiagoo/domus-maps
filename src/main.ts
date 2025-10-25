import './style.css'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import router from './modules/router'

const pinia = createPinia()

const app = createApp(App)
app.use(ui)
app.use(router)
app.use(pinia)
app.mount('#app')
