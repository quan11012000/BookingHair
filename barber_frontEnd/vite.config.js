import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fix cho sockjs-client
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  server: {
    port: 5178, // frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
