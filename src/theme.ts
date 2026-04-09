import "vite/modulepreload-polyfill"

import htmx from "htmx.org"
import "./alpine"
import { swup } from "./swup"

import "./utils/vvh"
import { swupPreloadChildren } from "./utils/swup-preload-children"

htmx.config.globalViewTransitions = true

swup.hooks.on("content:replace", () => {
  const main = document.querySelector("main")
  if (main) htmx.process(main)
})

document.addEventListener("htmx:afterSwap", (e: CustomEventInit) => {
  if (e.detail.pathInfo.responsePath.includes("cart")) {
    swup.cache.delete("/cart")
  }
})

swup.hooks.on("animation:out:start", () => {
  document.querySelectorAll("dialog")?.forEach(dialog => dialog?.close())
})

window.addEventListener("ajax:send", async (e: CustomEventInit) => {
  const cartUpdated = e.detail.action.includes("/cart")
  if (cartUpdated) swup.cache.delete("/cart")
})

window.addEventListener("ajax:after", async (e: CustomEventInit) => {
  swupPreloadChildren({ container: e.detail.render, exclude: "/cart/change" })
})

window.addEventListener("app:loading", (e: CustomEventInit) => {
  document.body.classList.toggle("is-loading", e.detail)
})
