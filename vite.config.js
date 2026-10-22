import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      // Ganymede agent server (checked first, it's the more specific path)
      '/api/agents': {
        target: 'http://localhost:8000',
      },
      // Content API: run `npm run dev:api` alongside `npm run dev`
      '/api': {
        target: 'http://localhost:3001',
      },
    },
  },
})
