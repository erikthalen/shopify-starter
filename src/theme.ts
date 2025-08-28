import "vite/modulepreload-polyfill"

import barba from "@barba/core"
import Alpine from "alpinejs"
import ajax from "@imacrayon/alpine-ajax"
import intersect from "@alpinejs/intersect"
import focus from "@alpinejs/focus"

import type { ITransitionData } from "@barba/core/dist/src/defs"
import { fixatePageOnNavigation } from "~/utils/utils"

import drawer from "./components/drawer"
import infiniteScroll from "./components/infinite-scroll"
import filter from "./components/filter"
import predictiveSearch from "./components/predictive-search"
import productForm from "./components/product-form"
import "./components/is-loading"

Alpine.plugin(intersect)
Alpine.plugin(ajax)
Alpine.plugin(focus)

// makes alpine.d.ts able to create types of each store
export const stores = {
  /* ... add your stores here ... */
}

for (const [key, store] of Object.entries(stores)) {
  Alpine.store(key, store)
}

Alpine.data("drawer", drawer)
Alpine.data("infiniteScroll", infiniteScroll)
Alpine.data("filter", filter)
Alpine.data("predictiveSearch", predictiveSearch)
Alpine.data("productForm", productForm)

Alpine.start()

document.body.removeAttribute("x-cloak")

barba.init({
  debug: location.origin.includes("127.0.0.1"),
  prevent: () => window.Shopify.designMode,
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
        custom: ({ trigger }) => {
          // link looks like <a data-transition="slide-right"></a>
          return (trigger as HTMLElement).dataset.transition === "slide-right"
        },
      },
      async leave({ current }) {
        return current.container.animate(
          { opacity: 0, translate: "-20px 0" },
          { duration: 100, easing: "ease-in", fill: "forwards" }
        ).finished
      },
      async enter({ next }) {
        const animation = next.container.animate(
          [
            { opacity: 0, translate: "20px 0" },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 100, easing: "ease-out", fill: "forwards" }
        )

        await animation.finished

        animation.cancel()

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
  const cart_drawer = document.getElementById(
    "cart_drawer"
  ) as HTMLDialogElement

  cart_drawer?.close()

  window.dispatchEvent(new CustomEvent("window:navigation"))
})

// place the old page "where it was" on navigation/scroll
fixatePageOnNavigation({ top: "2.5rem" })
