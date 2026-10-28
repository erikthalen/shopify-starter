import Alpine from "alpinejs"

// plugins
import intersect from "@alpinejs/intersect"

// components
import cartNotification from "./components/cart-notification"
import predictiveSearch from "./components/predictive-search"

Alpine.plugin(intersect)

Alpine.data("cartNotification", cartNotification)
Alpine.data("predictiveSearch", predictiveSearch)

export const alpineStores = {
  exampleStore: {
    count: 0,
    increment() {
      this.count++
    },
  },
}

for (const [key, store] of Object.entries(alpineStores)) {
  Alpine.store(key, store)
}

Alpine.start()

export default Alpine
