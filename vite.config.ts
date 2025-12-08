import { defineConfig } from "vite"
import shopify from "vite-plugin-shopify"
import topLevelAwait from "vite-plugin-top-level-await"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    topLevelAwait(),
    shopify({
      tunnel: true,
      snippetFile: "vite.liquid",
      entrypointsDir: "src",
      sourceCodeDir: "src",
    }),
    tailwindcss(),
  ],
  build: {
    manifest: "manifest.json",
  },
})
