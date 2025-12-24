import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // npm i path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve : { // for shadcn components
    alias : {
      '@' : path.resolve(__dirname, 'src')
    }
  },
  server : {
    port : 2010,
    proxy : {
      '/api' : {
        target : 'http://localhost:2020',
        changeOrigin : true,
        secure : false
      }
    }
  }
})
