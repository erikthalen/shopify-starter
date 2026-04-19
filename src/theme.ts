import "vite/modulepreload-polyfill"

import alpine from "./alpine"
import htmx from "htmx.org"
import type { HtmxResponseInfo } from "htmx.org"
import swup from "./swup"
import "idiomorph/htmx"
import "htmx-ext-preload"
import "./utils/vvh"
import { createHistoryRecord, Location } from "swup"
import { swupPreloadChildren } from "./utils/swup-preload-children"
import { swupUpdateCache } from "./utils/swup-update-cache"
import { loadingStates } from "./utils/htmx-ext-loading-states"
import { initHtmxMemoryCache } from "./utils/htmx-memory-cache"

if (window.location.origin.includes("127.0.0.1")) {
  window.Alpine = alpine
  window.Swup = swup
}

htmx.config.globalViewTransitions = true

loadingStates(htmx)
initHtmxMemoryCache(htmx)

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
 * Trigger swup preload of links dynamically added by htmx.
 * This does NOT preload links handled by htmx (<a data-no-swup>)
 */
document.addEventListener("htmx:after-swap", ((
  e: CustomEvent<HtmxResponseInfo>
) => {
  console.log('e.detail.target', e.detail)

  swupPreloadChildren({
    swup,
    container: e.detail.elt as HTMLElement,
    exclude: "/cart",
    strategy: "init",
  })
}) as EventListener)

/**
 * Clear swup cache for cart page when the cart is updated
 */
document.addEventListener("htmx:after-swap", ((
  e: CustomEvent<HtmxResponseInfo>
) => {
  if (e.detail.pathInfo?.responsePath?.includes("cart")) {
    swup.cache.delete("/cart")
  }
}) as EventListener)

/**
 * Navigating back to a PLP take you to the same infinite-loaded state as you left it in
 */
document.addEventListener("htmx:after-request", ((
  e: CustomEvent<HtmxResponseInfo>
) => {
  if (e.detail.target?.id === "paginated_items" && e.detail.xhr?.responseText) {
    setTimeout(() => {
      swupUpdateCache(swup, e.detail.xhr.responseText, [
        { merge: "append", id: "paginated_items" },
        { merge: "replace", id: "pagination" },
      ])
    }, 100)
  }
}) as EventListener)

/**
 * #shopify_payment_button can't be morphed — replace it with outerHTML after each variant swap
 */
document.addEventListener("htmx:after-swap", ((
  e: CustomEvent<HtmxResponseInfo>
) => {
  if (e.detail.target?.id !== "main_product" || !e.detail.xhr?.responseText)
    return

  const newButton = new DOMParser()
    .parseFromString(e.detail.xhr.responseText, "text/html")
    .getElementById("shopify_payment_button")

  const oldButton = document.getElementById("shopify_payment_button")

  if (newButton && oldButton) oldButton.replaceWith(newButton)
}) as EventListener)

/**
 * Using the filter on a PLP adds to the browser history
 */
document.addEventListener("htmx:after-request", ((
  e: CustomEvent<HtmxResponseInfo>
) => {
  if ((e.target as Element)?.getAttribute("swup-push-history") !== null) {
    const { responsePath } = e.detail.pathInfo
    if (!responsePath) return
    swup.location = Location.fromUrl(responsePath)
    createHistoryRecord(responsePath)
  }
}) as EventListener)
