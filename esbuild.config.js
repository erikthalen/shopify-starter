import * as esbuild from "esbuild"

/** @type {esbuild.BuildOptions} */
const options = {
  entryPoints: ["src/theme.ts", "src/video.ts", "src/theme.css"],
  outdir: "assets",
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
  // fonts and images already live in /assets, keep their urls as-is
  external: ["*.ttf", "*.woff", "*.woff2", "*.png", "*.jpg", "*.webp", "*.svg"],
  logLevel: "info",
}

if (process.argv.includes("--watch")) {
  const context = await esbuild.context({ ...options, minify: false })
  await context.watch()
} else {
  await esbuild.build(options)
}
