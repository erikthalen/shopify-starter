import "vite/modulepreload-polyfill"

import alpine from "./alpine"
import htmx from "htmx.org"
import swup from "./swup"
import "idiomorph/dist/idiomorph-ext.esm.js"
import "./utils/vvh"
import { createHistoryRecord } from "swup"
import { swupPreloadChildren } from "./utils/swup-preload-children"
import { swupUpdateCache } from "./utils/swup-update-cache"

window.Alpine = alpine

htmx.config.globalViewTransitions = true

swup.hooks.on("content:replace", () => {
  htmx.process(document.querySelector("main")!)
})

swup.hooks.on("visit:start", () => {
  for (const dialog of document.querySelectorAll("dialog")) {
    dialog.close()
  }
})

document.addEventListener("htmx:before-request", (e: CustomEventInit) => {
  const target =
    e.detail.requestConfig?.triggeringEvent?.submitter ||
    e.detail.requestConfig.elt

  target?.setAttribute("aria-busy", "true")
})

document.addEventListener("htmx:after-request", (e: CustomEventInit) => {
  const target =
    e.detail.requestConfig?.triggeringEvent?.submitter ||
    e.detail.requestConfig.elt

  target?.removeAttribute("aria-busy")
})

document.addEventListener("htmx:after-swap", (e: CustomEventInit) => {
  const { elt, pathInfo, target } = e.detail

  swupPreloadChildren({ swup, container: elt, exclude: "/cart/change" })

  if (pathInfo?.responsePath?.includes("cart")) {
    swup.cache.delete("/cart")
  }

  if (target?.id === "main_collection") {
    // TODO: when navigating back after having used the filter, the page content isn't updated
    createHistoryRecord(pathInfo.responsePath)
  }

  if (target?.id === "paginated_items" && e.detail.xhr?.responseText) {
    // TODO: duplicated loaded items are on the page when navigating back to the plp
    swupUpdateCache(swup, e.detail.xhr.responseText, [
      { merge: "append", id: "paginated_items" },
      { merge: "replace", id: "pagination" },
    ])
  }
})

// TODO: we don't want this, and it doesn't work
swup.hooks.on("history:popstate", () => {
  if (!document.querySelector("#main_collection")) return

  htmx.ajax("get", window.location.href, {
    target: "#main_collection",
    select: "#main_collection",
    swap: "outerHTML",
  })
})

// window.addEventListener("app:loading", (e: CustomEventInit) => {
//   document.body.classList.toggle("is-loading", e.detail)
// })
