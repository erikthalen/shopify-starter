import "vite/modulepreload-polyfill"

import Swup from "swup"
import SwupA11yPlugin from "@swup/a11y-plugin"
import SwupPreloadPlugin from "@swup/preload-plugin"
import SwupJsPlugin from "@swup/js-plugin"
import SwupDebugPlugin from "@swup/debug-plugin"
import Alpine from "alpinejs"

import "./utils/vvh"
import type { Transitions } from "./types"

Alpine.plugin((await import("@alpinejs/intersect")).default)
Alpine.plugin((await import("@alpinejs/morph")).default)
Alpine.plugin((await import("@imacrayon/alpine-ajax")).default)
Alpine.plugin((await import("./utils/alpine-swap")).default)
Alpine.plugin((await import("./utils/alpine-sync-params")).default)

// makes alpine.d.ts able to create types of each store
export const stores = {
  /* ... add your stores here ... */
}

for (const [key, store] of Object.entries(stores)) {
  Alpine.store(key, store)
}

Alpine.data(
  "cartNotification",
  (await import("./components/cart-notification")).default
)
Alpine.data(
  "emblaCarousel",
  (await import("./components/embla-carousel")).default
)
Alpine.data(
  "infiniteScroll",
  (await import("./components/infinite-scroll")).default
)
Alpine.data(
  "predictiveSearch",
  (await import("./components/predictive-search")).default
)
Alpine.data(
  "quantitySelector",
  (await import("./components/quantity-selector")).default
)

document.body.removeAttribute("x-cloak")

const __debug__ = false

const transitions: Transitions = {
  "slide-right": {
    in: [[{ opacity: 0, translate: "10px 0" }, { opacity: 1 }], 100],
    out: [[{ opacity: 1 }, { opacity: 0, translate: "-10px 0" }], 100],
  },

  default: {
    in: [[{ opacity: 0, translate: "0 -10px" }, { opacity: 1 }], 100],
    out: [[{ opacity: 1 }, { opacity: 0, translate: "0 10px" }], 100],
  },
}

window.swup = new Swup({
  plugins: [
    ...(__debug__ && location.origin.includes("127.0.0.1")
      ? [new SwupDebugPlugin()]
      : []),
    new SwupA11yPlugin(),
    new SwupPreloadPlugin({
      preloadVisibleLinks: {
        ignore: el => el.href.toString().includes("/cart"),
      },
    }),
    new SwupJsPlugin({
      animations: [
        {
          from: "(.*)",
          to: "(.*)",
          in: async (_, data) => {
            const trigger = data.visit.trigger.el as HTMLElement
            const transitionName = trigger?.dataset.transition
            const transition = transitions[transitionName || "default"].in

            await document.querySelector("#swup")?.animate(...transition)
              .finished

            return
          },
          out: async (_, data) => {
            const trigger = data.visit.trigger.el as HTMLElement
            const transitionName = trigger?.dataset.transition
            const transition = transitions[transitionName || "default"].out

            await document.querySelector("#swup")?.animate(...transition)
              .finished
          },
        },
      ],
    }),
  ],
})

window.swup.hooks.on("animation:out:start", () => {
  document.querySelectorAll("dialog")?.forEach(dialog => dialog?.close())
  window.dispatchEvent(new CustomEvent("window:navigation"))
})

Alpine.start()

/**
 * listen for loading events
 */
window.addEventListener("app:loading", (e: CustomEventInit) => {
  document.body.classList.toggle("is-loading", e.detail)
})
