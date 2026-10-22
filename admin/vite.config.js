import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5174,
    proxy: {
      // Content API: run `npm run dev:api` in the portfolio folder
      '/api': { target: 'http://localhost:3001' },
    },
  },
})
