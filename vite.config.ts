import { defineConfig } from "vite"
import shopify from "vite-plugin-shopify"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    shopify({
      snippetFile: "vite.liquid",
      entrypointsDir: "src",
      sourceCodeDir: "src",
    }),
    tailwindcss(),
  ],
  publicDir: "public",
  build: {
    sourcemap: false,
    manifest: "manifest.json",
  },
})
