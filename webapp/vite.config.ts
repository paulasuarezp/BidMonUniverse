import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html', // Ruta de entrada a la app
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'] // Lista de dependencias a pre-bundlear
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000' // Restapi
    },
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // Puerto por defecto de Vite
  }
})
