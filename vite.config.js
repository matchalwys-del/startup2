import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // WAJIB: Agar path hasil build menjadi relatif saat dimuat di Chrome
})