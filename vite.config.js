import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false, // Si el puerto está ocupado, busca automáticamente uno disponible
    host: true, // Escucha en todas las interfaces
    open: true, // Abre el navegador automáticamente
  },
})
