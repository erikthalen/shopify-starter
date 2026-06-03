import * as esbuild from "esbuild"

const result = await esbuild.build({
  entryPoints: ["src/theme.ts"],
  bundle: true,
  outdir: "assets",
  minify: true,
  sourcemap: true,
  metafile: true,
})

// console.log(await esbuild.analyzeMetafile(result.metafile))
