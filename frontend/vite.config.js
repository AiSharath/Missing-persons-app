import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure public directory is served correctly
  publicDir: 'public',
  build: {
    // Ensure models are copied to the build output
    copyPublicDir: true,
    // Increase chunk size warning limit for model files (they're large)
    chunkSizeWarningLimit: 2000,
    // Ensure public directory files are copied as-is
    assetsDir: 'assets',
  },
  // Ensure base path works in both dev and production
  base: '/',
})
