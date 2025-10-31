import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500, // 設置為 500KB
    rollupOptions: {
      output: {
        manualChunks: {
          // 將大型庫分割成獨立的 chunks
          'recharts-vendor': ['recharts'],
          'xlsx-vendor': ['xlsx'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
