import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ⭐ Add this block (PORT CONFIG)
  server: {
    port: 5174,   // ← Jo port chaho daal sakte ho
    open: true
  }
})
