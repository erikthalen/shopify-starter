// import { resolve } from 'node:path'
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
  resolve: {
    alias: {
      // '~resources': resolve('resources/js'),
      // '~modules': resolve('frontend/modules')
    }
  },
  plugins: [
    topLevelAwait(),
    shopify({
      snippetFile: 'vite.liquid',
      additionalEntrypoints: [
        // 'frontend/modules/**/*.ts',
        // 'resources/**/*.js' // relative to themeRoot
      ]
    }),
    pageReload('/tmp/theme.update', {
      delay: 2000
    })
  ],
  build: {
    sourcemap: true,
  }
})
