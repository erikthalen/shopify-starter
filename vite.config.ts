import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import pageReload from 'vite-plugin-page-reload'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3001
  },
  publicDir: 'public',
  plugins: [
    topLevelAwait(),
    shopify({
      snippetFile: 'vite.liquid',
      entrypointsDir: 'frontend/'
    }),
    pageReload('/tmp/theme.update', {
      delay: 5000
    })
  ],
  build: {
    sourcemap: true,
  }
})
