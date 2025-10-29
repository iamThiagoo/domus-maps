import './utils/styles/global.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import router from './utils/modules/router.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(ui)
app.use(pinia)
app.mount('#app')
