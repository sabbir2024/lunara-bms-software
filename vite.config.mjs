import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  root: 'src/renderer',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    // Add these options:
    assetsDir: '.', // Put assets in the root
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]' // Keep original filenames
      }
    }
  },
  base: './', // This is important for Electron
  server: {
    port: 5173,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@components': resolve(__dirname, 'src/renderer/components'),
      '@pages': resolve(__dirname, 'src/renderer/pages')
    }
  }
})