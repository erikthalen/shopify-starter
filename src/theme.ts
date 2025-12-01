import "vite/modulepreload-polyfill"

import { swup } from "./swup"
import Alpine, { type Stores } from "alpinejs"

import "./utils/vvh"

/**
 * Register Alpine plugins
 */
Alpine.plugin((await import("@alpinejs/intersect")).default)
Alpine.plugin((await import("@alpinejs/morph")).default)
Alpine.plugin((await import("@imacrayon/alpine-ajax")).default)
Alpine.plugin((await import("./utils/alpine-swap")).default)
Alpine.plugin((await import("./utils/alpine-sync-params")).default)

// makes alpine.d.ts able to create types of each store
export const stores: Record<string, Stores> = {
  /* ... add your stores here ... */
}

for (const [key, store] of Object.entries(stores)) {
  Alpine.store(key, store)
}

/**
 * Register Alpine components
 */
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

/**
 * Intro animation
 */
document.body.removeAttribute("x-cloak")
document
  .getElementById("swup")
  ?.animate([{ opacity: 0, translate: "0 20px" }, { opacity: 1 }], {
    duration: 800,
    easing: "cubic-bezier(0.5, 0, 0, 1)",
  })

/**
 * Init Alpine
 */
Alpine.start()

/**
 * Global hooks
 */
swup.hooks.on("animation:out:start", () => {
  document.querySelectorAll("dialog")?.forEach(dialog => dialog?.close())
  window.dispatchEvent(new CustomEvent("window:navigation"))
})

window.addEventListener("ajax:send", async (e: CustomEventInit) => {
  const cartUpdated = e.detail.action.includes("/cart")

  if (cartUpdated) {
    swup.cache.delete("/cart")
  }
})

window.addEventListener("ajax:after", async (e: CustomEventInit) => {
  // preload all links in any element appended by Alpine Ajax
  if (typeof swup.preload === "function") {
    const allHrefsInAppendedElement: string[] = e.detail.render
      .map((el: HTMLElement) => {
        const elementsWithHref = [...el.querySelectorAll("*[href]")]
        return elementsWithHref.map(
          el => window.location.origin + el.getAttribute("href")
        )
      })
      .flat()
      .filter((href: string) => !href.includes("/cart/change"))

    if (allHrefsInAppendedElement.length) {
      await swup.preload(allHrefsInAppendedElement)
    }
  }
})

/**
 * Global events
 */
window.addEventListener("app:loading", (e: CustomEventInit) => {
  document.body.classList.toggle("is-loading", e.detail)
})
