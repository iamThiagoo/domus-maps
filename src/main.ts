import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'

import pinia from './modules/pinia'
import router from './modules/router'

const app = createApp(App)
app.use(ui)
app.use(router)
app.use(pinia)
app.mount('#app')