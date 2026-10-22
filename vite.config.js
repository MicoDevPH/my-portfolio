import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      // Content API: run `npm run dev:api` alongside `npm run dev`
      '/api': {
        target: 'http://localhost:3001',
      },
    },
  },
})
