import "vite/modulepreload-polyfill"

import alpine from "./alpine"
import htmx from "htmx.org"
import swup from "./swup"
import "idiomorph/htmx"
import "./utils/vvh"
import { createHistoryRecord, Location } from "swup"
import { swupPreloadChildren } from "./utils/swup-preload-children"
import { swupUpdateCache } from "./utils/swup-update-cache"
import { loadingStates } from "./utils/htmx-ext-loading-states"

window.Alpine = alpine
window.Swup = swup

htmx.config.globalViewTransitions = true

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

// document.addEventListener("htmx:before-request", (e: CustomEventInit) => {
//   const target =
//     e.detail.requestConfig?.triggeringEvent?.submitter ||
//     e.detail.requestConfig.elt

//   target?.setAttribute("aria-busy", "true")
// })

// document.addEventListener("htmx:after-request", (e: CustomEventInit) => {
//   const target =
//     e.detail.requestConfig?.triggeringEvent?.submitter ||
//     e.detail.requestConfig.elt

//   target?.removeAttribute("aria-busy")
// })

/**
 * Trigger swup preload of links dynamically added by htmx
 */
document.addEventListener("htmx:after-swap", (e: CustomEventInit) => {
  swupPreloadChildren({
    swup,
    container: e.detail.elt,
    exclude: "/cart/change",
  })
})

/**
 * Clear swup cache for cart page when the cart is updated
 */
document.addEventListener("htmx:after-swap", (e: CustomEventInit) => {
  if (e.detail.pathInfo?.responsePath?.includes("cart")) {
    swup.cache.delete("/cart")
  }
})

/**
 * Make navigating back to a PLP take you to the same state as you left it
 */
document.addEventListener("htmx:after-request", (e: CustomEventInit) => {
  if (e.detail.target?.id === "paginated_items" && e.detail.xhr?.responseText) {
    // TODO: duplicated loaded items are on the page when navigating back to the plp
    setTimeout(() => {
      swupUpdateCache(swup, e.detail.xhr.responseText, [
        { merge: "append", id: "paginated_items" },
        { merge: "replace", id: "pagination" },
      ])
    }, 100)
  }
})

/**
 * Using the filter on a PLP and using the back button takes you to the previous filter state
 */
document.addEventListener("htmx:after-request", (e: CustomEventInit) => {
  if (e.detail.target?.id === "filter_result") {
    const { responsePath } = e.detail.pathInfo
    swup.location = Location.fromUrl(responsePath)
    createHistoryRecord(responsePath)
  }
})
