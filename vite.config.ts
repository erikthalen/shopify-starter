import { defineConfig } from "vite"
import shopify from "vite-plugin-shopify"
import topLevelAwait from "vite-plugin-top-level-await"
import tailwindcss from "@tailwindcss/vite"

// allow localhost and any subdomain of myshopify.com (dev admin panel)
const allowedOriginsRegex =
  /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?|https:\/\/[a-zA-Z0-9-]+\.myshopify\.com)$/

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 3001,
    cors: {
      origin: allowedOriginsRegex,
    },
  },
  publicDir: "public",
  plugins: [
    topLevelAwait(),
    shopify({
      snippetFile: "vite.liquid",
      entrypointsDir: "src",
      sourceCodeDir: "src",
    }),
    tailwindcss(),
  ],
  assetsInclude: "**/*.md",
  build: {
    sourcemap: true,
    manifest: "manifest.json",
  },
})
