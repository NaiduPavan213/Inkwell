import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      // Forward any request starting with /api to your backend
      '/api': {
        // Replace this with your actual backend server address
        target: 'http://localhost:5000', 
        changeOrigin: true,
      },
    },
  },
})