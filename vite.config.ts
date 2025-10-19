import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import ui, { type NuxtUIOptions } from '@nuxt/ui/vite'
import path from 'path'
import formField from './src/utils/ui/form-field'
import input from './src/utils/ui/input'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    ui({
      ui: {
        colors: {
          primary: 'violet',
        },
        theme: {
          light: true,
          dark: false
        },
        classStrategy: 'none',
        formField,
        input
      },
    } as NuxtUIOptions),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
