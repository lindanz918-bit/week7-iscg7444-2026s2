import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Required for Docker container mapping
    port: 3000,      // Specifies the internal port
    strictPort: true // Prevents Vite from auto-switching ports if 5173 is busy
  }

})
