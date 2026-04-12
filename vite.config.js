import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  publicDir: 'Médias',
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main:      resolve(__dirname, 'index.html'),
        connexion: resolve(__dirname, 'connexion.html'),
        dashboard: resolve(__dirname, 'tableau-de-bord.html'),
        admin:     resolve(__dirname, 'admin.html'),
      }
    }
  }
})
