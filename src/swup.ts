import Swup from "swup"
import SwupA11yPlugin from "@swup/a11y-plugin"
import SwupPreloadPlugin from "@swup/preload-plugin"
import SwupJsPlugin from "@swup/js-plugin"
import SwupDebugPlugin from "@swup/debug-plugin"
import type { Transitions } from "./types"

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

export const swup = new Swup({
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
            /**
             * Find clicked elements [data-transition] attribute
             * and play corresponding transition
             */
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
