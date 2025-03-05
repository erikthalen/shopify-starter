import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import pageReload from 'vite-plugin-page-reload'
import topLevelAwait from 'vite-plugin-top-level-await'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3001,
  },
  publicDir: 'public',
  plugins: [
    topLevelAwait(),
    shopify({
      snippetFile: 'vite.liquid',
      entrypointsDir: 'src',
      sourceCodeDir: 'src'
    }),
    pageReload('/tmp/theme.update'),
    tailwindcss(),
  ],
  assetsInclude: '**/*.md',
  build: {
    sourcemap: true,
    manifest: 'manifest.json',
  },
})
