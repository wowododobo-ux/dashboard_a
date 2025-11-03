import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 本機開發配置
export default defineConfig({
  plugins: [react()],
  base: '/', // 本機開發使用根路徑
  server: {
    port: 5173,
    open: true, // 自動開啟瀏覽器
  },
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
