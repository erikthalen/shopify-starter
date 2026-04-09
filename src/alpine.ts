import Alpine from "alpinejs"

Alpine.plugin((await import("@alpinejs/intersect")).default)
Alpine.plugin((await import("@alpinejs/morph")).default)
// Alpine.plugin((await import("@imacrayon/alpine-ajax")).default)
Alpine.plugin((await import("./utils/alpine-swap")).default)
Alpine.plugin((await import("./utils/alpine-sync-params")).default)

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

export const stores = {
  example: {
    count: 0,
    increment() {
      this.count++
    },
  },
}

for (const [key, store] of Object.entries(stores)) {
  Alpine.store(key, store)
}

Alpine.start()

export { Alpine }
