import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig({
  define: {
    'import.meta.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
    'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || ''),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo/favicon.svg'],
      manifest: {
        name: 'Amazon Wind — Expedições & Kitesurf',
        short_name: 'Amazon Wind',
        description: 'Escola de Kitesurf e Expedições na Amazônia Atlântica',
        theme_color: '#9d5d32',
        background_color: '#f2e4bf',
        display: 'standalone',
        icons: [
          {
            src: '/logo/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
