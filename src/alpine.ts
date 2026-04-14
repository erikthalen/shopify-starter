import Alpine from "alpinejs"

// plugins
import intersect from "@alpinejs/intersect"

// components
import cartNotification from "./components/cart-notification"
import emblaCarousel from "./components/embla-carousel"
import quantitySelector from "./components/quantity-selector"

Alpine.plugin(intersect)

Alpine.data("cartNotification", cartNotification)
Alpine.data("emblaCarousel", emblaCarousel)
Alpine.data("quantitySelector", quantitySelector)

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

export default Alpine
