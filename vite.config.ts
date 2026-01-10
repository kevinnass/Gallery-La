import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // Liste ici tes grosses dépendances pour éviter qu'il les re-scanne sans cesse
    include: [
      'react', 'react-dom', 'react-redux', 
      '@reduxjs/toolkit', 'lucide-react', 'framer-motion'
    ],
  },
  server: {
    // Optionnel : Réduit la charge du scanner de fichiers sur Antigravity
    watch: {
      usePolling: true, 
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  }
})