import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin to ensure models are copied after build
    {
      name: 'copy-models',
      closeBundle() {
        const modelsDir = join(process.cwd(), 'public', 'models')
        const distModelsDir = join(process.cwd(), 'dist', 'models')
        
        if (existsSync(modelsDir)) {
          console.log('📦 Ensuring models are copied to dist...')
          // Vite should copy public directory automatically, but we verify
          if (!existsSync(distModelsDir)) {
            console.warn('⚠️ Models directory not found in dist. Make sure public/models exists.')
          } else {
            console.log('✅ Models directory found in dist')
          }
        }
      }
    }
  ],
  // Ensure public directory is served correctly
  publicDir: 'public',
  build: {
    // Ensure models are copied to the build output
    copyPublicDir: true,
    // Increase chunk size warning limit for model files (they're large)
    chunkSizeWarningLimit: 2000,
    // Ensure public directory files are copied as-is
    assetsDir: 'assets',
    // Don't minify model files (they're binary)
    // Note: Vite handles public directory files separately, so they won't be minified
  },
  // Ensure base path works in both dev and production
  base: '/',
})
