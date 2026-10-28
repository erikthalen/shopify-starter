// must run before Alpine and htmx initialize the DOM
import "./utils/infinite-scroll-cache"
import alpine from "./alpine"
import htmx from "htmx.org"
import "htmx.org/dist/ext/hx-preload.js"
import "htmx.org/dist/ext/hx-alpine-compat.js"
import "./utils/vvh"
import { loadingStates } from "./utils/htmx-ext-loading-states"
import "dialog-closedby-polyfill"

import "@blossom-carousel/web"

import "@videojs/html/background/player"
import "@videojs/html/background/video"
import "@videojs/html/background/skin"

// the hx-alpine-compat extension reads Alpine from window
window.Alpine = alpine

htmx.config.noSwap = [204, 304, "4xx", "5xx"] as unknown as number[]

/**
 * Keep the client-side [open] state of <dialog> and <details> when morphing
 */
htmx.config.morphIgnore.push("open")

loadingStates(htmx)

/**
 * #shopify_payment_button can't be morphed — replace it with outerHTML after each variant swap
 */
document.addEventListener("htmx:after:swap", e => {
  const { target, text } = e.detail.ctx
  if (target?.id !== "product_content" || !text) return

  const newButton = new DOMParser()
    .parseFromString(text, "text/html")
    .getElementById("shopify_payment_button")

  const oldButton = document.getElementById("shopify_payment_button")

  if (newButton && oldButton) oldButton.replaceWith(newButton)
})
