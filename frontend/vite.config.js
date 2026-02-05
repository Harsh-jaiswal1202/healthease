import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  build: {
    // Warn at a higher limit to avoid noisy warnings, and split vendor chunks to reduce large bundles
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor.react';
            if (id.includes('stripe') || id.includes('axios')) return 'vendor.payments';            if (id.includes('framer-motion') || id.includes('gsap')) return 'vendor.animations';
            if (id.includes('react-router-dom')) return 'vendor.router';            return 'vendor';
          }
        }
      }
    }
  }
})
