import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Updated: Backend URL pointing to Railway (Dec 2024)
export default defineConfig({
  plugins: [react()],
  define: {
    // Inject environment variables with fallbacks for production
    'import.meta.env.VITE_API_BASE': JSON.stringify(
      process.env.VITE_API_BASE || 'https://nane-vida-mvp-production.up.railway.app/api'
    ),
    'import.meta.env.VITE_ENV': JSON.stringify(
      process.env.VITE_ENV || 'production'
    ),
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    // CORS configuration for development
    cors: true,
    // Security headers
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
  },
  build: {
    // Production optimizations
    minify: 'terser',
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Optimized manual chunks for better caching and performance
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // Router (separate for better caching)
          'router-vendor': ['react-router-dom'],
          // HTTP client
          'axios-vendor': ['axios'],
          // Context providers (loaded early)
          'contexts': [
            './src/contexts/ToastContext.tsx',
            './src/contexts/ThemeContext.tsx',
            './src/contexts/OnboardingContext.tsx',
            './src/contexts/ReminderContext.tsx'
          ],
          // Shared UI components (used across pages)
          'ui-components': [
            './src/components/ui/Button.tsx',
            './src/components/ui/Card.tsx',
            './src/components/ui/LoadingSpinner.tsx'
          ]
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Security: remove console logs in production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    }
  },
  // Preview server configuration (for production testing)
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
  }
})
