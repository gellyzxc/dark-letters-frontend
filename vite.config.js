import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    electron([
      {
        // Main process entry file
        entry: 'electron/main.js',
        onstart(args) {
          // Создаем package.json в dist-electron перед запуском
          try {
            mkdirSync('dist-electron', { recursive: true })
            writeFileSync(
              join('dist-electron', 'package.json'),
              JSON.stringify({ type: 'commonjs' }, null, 2)
            )
          } catch (e) {
            console.error('Failed to create dist-electron/package.json:', e)
          }
          args.startup()
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron', 'path']
            }
          }
        }
      },
      {
        // Preload script
        entry: 'electron/preload.js',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            outDir: 'dist-electron'
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'swiper': ['swiper']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/styles/_variables.scss";`,
      },
    },
  },
})
