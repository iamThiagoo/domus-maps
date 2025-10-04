import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'

import pinia from './modules/pinia'
import router from './modules/router'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'

const app = createApp(App)
app.use(ui)
app.use(router)
app.use(pinia)
app.use(Particles, {
  init: async engine => {
    await loadSlim(engine)
  },
})
app.mount('#app')
