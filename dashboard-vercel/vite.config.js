import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Vercel 生產環境配置
export default defineConfig({
  plugins: [react()],
  base: '/', // Vercel 部署使用根路徑
  build: {
    chunkSizeWarningLimit: 500, // 設置為 500KB
    outDir: 'dist',
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
