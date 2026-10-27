import alpine from "./alpine"
import htmx from "htmx.org"
import type { HtmxRequestCtx } from "htmx.org"
import "htmx.org/dist/ext/hx-preload.js"
import "htmx.org/dist/ext/hx-alpine-compat.js"
import swup from "./swup"
import "./utils/vvh"
import { createHistoryRecord, updateHistoryRecord, Location } from "swup"
import { swupPreloadChildren } from "./utils/swup-preload-children"
import { swupUpdateCache } from "./utils/swup-update-cache"
import { loadingStates } from "./utils/htmx-ext-loading-states"

// the hx-alpine-compat extension reads Alpine from window
window.Alpine = alpine

if (window.location.origin.includes("127.0.0.1")) {
  window.Swup = swup
}

htmx.config.transitions = true

/**
 * Swup owns the browser history. With history enabled, htmx would intercept every
 * back/forward navigation, so hx-push-url, hx-replace-url and boosted requests
 * are written to history through swup instead (see below).
 */
htmx.config.history = false

/**
 * Don't swap error responses (htmx 4 swaps everything except 204 and 304 by default).
 * The htmx types only allow numbers, but status patterns like "4xx" are supported.
 */
htmx.config.noSwap = [204, 304, "4xx", "5xx"] as unknown as number[]

loadingStates(htmx)

/**
 * Re-process htmx after page navigation, mimic window.onload behavior
 */
swup.hooks.on("content:replace", () => {
  htmx.process(document.querySelector("main")!)
})

/**
 * Close all open dialogs on page navigation
 */
swup.hooks.on("visit:start", () => {
  for (const dialog of document.querySelectorAll("dialog")) {
    dialog.close()
  }
})

/**
 * Write hx-push-url, hx-replace-url and boosted requests to history through swup
 */
function resolveHistoryUrl(
  value: string | boolean | null | undefined,
  ctx: HtmxRequestCtx
) {
  if (!value || value === "false") return null
  if (value !== true && value !== "true") return value

  const url = new URL(
    ctx.response?.raw.url || ctx.request.action,
    window.location.href
  )
  return url.pathname + url.search
}

document.addEventListener("htmx:after:swap", e => {
  const { ctx } = e.detail
  const boosted = ctx.request.headers["HX-Boosted"] === "true"
  const pushUrl = resolveHistoryUrl(ctx.push ?? boosted, ctx)
  const replaceUrl = resolveHistoryUrl(ctx.replace, ctx)

  if (pushUrl) {
    createHistoryRecord(pushUrl)
  } else if (replaceUrl) {
    updateHistoryRecord(replaceUrl)
  } else {
    return
  }

  swup.location = Location.fromUrl(pushUrl ?? replaceUrl!)
})

/**
 * Trigger swup preload of links dynamically added by htmx.
 * This does NOT preload links handled by htmx (<a data-no-swup>)
 */
document.addEventListener("htmx:after:settle", e => {
  swupPreloadChildren({
    swup,
    container: e.detail.newContent.filter(node => node instanceof HTMLElement),
    exclude: "/cart",
    strategy: "init",
  })
})

/**
 * Clear swup cache for cart page when the cart is updated
 */
document.addEventListener("htmx:after:swap", e => {
  if (e.detail.ctx.request.action.includes("/cart")) {
    swup.cache.delete("/cart")
  }
})

/**
 * Navigating back to a PLP take you to the same infinite-loaded state as you left it in
 */
document.addEventListener("htmx:after:request", e => {
  const { target, text } = e.detail.ctx
  if (target?.id !== "paginated_items" || !text) return

  setTimeout(() => {
    swupUpdateCache(swup, text, [
      { merge: "append", id: "paginated_items" },
      { merge: "replace", id: "pagination" },
    ])
  }, 100)
})

/**
 * #shopify_payment_button can't be morphed — replace it with outerHTML after each variant swap
 */
document.addEventListener("htmx:after:swap", e => {
  const { target, text } = e.detail.ctx
  if (target?.id !== "main_product" || !text) return

  const newButton = new DOMParser()
    .parseFromString(text, "text/html")
    .getElementById("shopify_payment_button")

  const oldButton = document.getElementById("shopify_payment_button")

  if (newButton && oldButton) oldButton.replaceWith(newButton)
})
