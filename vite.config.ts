import { defineConfig } from "vite"
import shopify from "vite-plugin-shopify"

export default defineConfig({
  plugins: [
    shopify({
      snippetFile: "vite.liquid",
      entrypointsDir: "src",
      sourceCodeDir: "src",
    }),
  ],
  publicDir: "public",
  build: {
    sourcemap: false,
    manifest: "manifest.json",
  },
})
