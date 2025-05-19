import "vite/modulepreload-polyfill"

import barba from "@barba/core"
import type { ITransitionData } from "@barba/core/dist/src/defs"
import Alpine from "alpinejs"

import { fixatePageOnNavigation } from "~/utils/utils"

import cartStore from "./components/cart-store"
import cartForm from "./components/cart-form"
import filter from "./components/filter"
import "./components/is-loading"
import mainCollection from "./components/main-collection"
import predictiveSearch from "./components/predictive-search"
import productForm from "./components/product-form"
import productRecommendations from "./components/product-recommendations"
import cartDrawer from "./components/cart-drawer"

// makes alpine.d.ts create types of each store
export const stores = {
  cartStore,

  /* ... add stores ... */
}

for (const [key, store] of Object.entries(stores)) {
  Alpine.store(key, store)
}

Alpine.data("cartForm", cartForm)
Alpine.data("cartDrawer", cartDrawer)
Alpine.data("filter", filter)
Alpine.data("mainCollection", mainCollection)
Alpine.data("predictiveSearch", predictiveSearch)
Alpine.data("productForm", productForm)
Alpine.data("productRecommendations", productRecommendations)

Alpine.start()

barba.init({
  debug: location.origin.includes("127.0.0.1"),
  prevent: () => window.Shopify.designMode,
  prefetchIgnore: "/cart",
  cacheIgnore: "/cart",
  transitions: [
    {
      name: "self",
      beforeLeave() {
        document.documentElement.style.scrollBehavior = "smooth"
      },
      enter() {
        return new Promise(resolve => setTimeout(resolve, 1000))
      },
      after() {
        document.documentElement.style.removeProperty("scroll-behavior")
      },
    },
    {
      name: "slide-right",
      sync: true, // make browser keep history scroll position
      from: {
        custom: ({ trigger }) =>
          (trigger as HTMLElement).dataset.transition === "slide-right",
      },
      async leave({ current }) {
        return current.container.animate(
          { opacity: 0, translate: "-20px 0" },
          { duration: 100, easing: "ease-in", fill: "forwards" }
        ).finished
      },
      async enter({ next }) {
        await next.container.animate(
          [
            { opacity: 0, translate: "20px 0" },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 100, easing: "ease-out", fill: "forwards" }
        ).finished

        return
      },
    },
    {
      name: "default",
      sync: true, // make browser keep history scroll position
      from: {
        custom: ({ trigger }) => !(trigger as HTMLElement)?.dataset?.transition,
      },
      async once({ next }) {
        document.body.removeAttribute("x-cloak")

        const animation = next.container.animate(
          [
            { opacity: 0, translate: "0 20px" },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 800, easing: "ease", fill: "forwards" }
        )

        await animation.finished

        animation.cancel()
      },
      async leave(data) {
        const animation = data.current.container.animate(
          { opacity: 0, translate: "0 20px" },
          { duration: 100, easing: "ease-in", fill: "forwards" }
        )

        // @ts-expect-error: Property 'leaveAnimation' does not exist on type 'ITransitionData'.
        data.leaveAnimation = animation as Animation

        return animation.finished
      },
      async enter(data) {
        data.next.container.style.opacity = "0"

        // fake the { sync: false } option
        // @ts-expect-error: Property 'leaveAnimation' does not exist on type 'ITransitionData'.
        await data.leaveAnimation.finished

        const animation = data.next.container.animate(
          [
            { opacity: 0, translate: "0 -20px" },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 100, easing: "ease-out", fill: "forwards" }
        )

        await animation.finished

        animation.cancel()
        data.next.container.style.removeProperty("opacity")

        return
      },
    },
  ],
})

// bug: chrome doesn't scroll to top if new page is prefetched and cached.
barba.hooks.beforeEnter(data => {
  const { trigger } = data as ITransitionData
  if (trigger !== "back" && trigger !== "forward") {
    setTimeout(() => window.scrollTo(0, 0))
  }
})

barba.hooks.before(() => {
  window.dispatchEvent(new CustomEvent("window:navigation"))
})

// place the old page "where it was" on navigation/scroll
fixatePageOnNavigation({ top: "2.5rem" })
