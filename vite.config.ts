import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import compression from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '@/assets/styles/main.scss' as *;
        `,
        api: 'modern-compiler'
      }
    }
  },
  plugins: [vue(), vueDevTools(), svgLoader(), compression()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
