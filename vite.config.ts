import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    host: '127.0.0.1',  // Forzar IPv4 en lugar de IPv6 (::1)
    port: 5173          // Asegúrate de que es el puerto correcto
  }
})
