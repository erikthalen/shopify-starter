import "vite/modulepreload-polyfill"
import barba from "@barba/core"
import Alpine from "alpinejs"
import "./utils/vvh"
import { fixatePageOnNavigation } from "~/utils/utils"
import type { ITransitionData } from "@barba/core/dist/src/defs"

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

Alpine.start()

document.body.removeAttribute("x-cloak")

let leaveAnimation: Animation

barba.init({
  debug: location.origin.includes("127.0.0.1"),
  prevent: () => window.Shopify.designMode,
  cacheIgnore: "/cart",
  transitions: [
    // {
    //   name: "self",
    //   beforeLeave() {
    //     document.documentElement.style.scrollBehavior = "smooth"
    //   },
    //   enter() {
    //     return new Promise(resolve => setTimeout(resolve, 1000))
    //   },
    //   after() {
    //     document.documentElement.style.removeProperty("scroll-behavior")
    //   },
    // },
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

        leaveAnimation = animation

        return animation.finished
      },
      async enter(data) {
        data.next.container.style.opacity = "0"

        // fake the { sync: false } option
        await leaveAnimation.finished

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
  document.querySelectorAll("dialog")?.forEach(dialog => dialog?.close())

  window.dispatchEvent(new CustomEvent("window:navigation"))
})

// place the old page "where it was" on navigation/scroll
fixatePageOnNavigation({ top: "2.5rem" })

/**
 * listen for loading events
 */
window.addEventListener("app:loading", (e: CustomEventInit) => {
  document.body.classList.toggle("is-loading", e.detail)
})
