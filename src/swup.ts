import Swup from "swup"
import SwupA11yPlugin from "@swup/a11y-plugin"
import SwupPreloadPlugin from "@swup/preload-plugin"

export default new Swup({
  skipPopStateHandling: () => false,
  animationSelector: false,
  linkToSelf: "navigate",
  plugins: [
    new SwupA11yPlugin(),
    new SwupPreloadPlugin({ preloadVisibleLinks: { delay: 0, threshold: 0 } }),
  ],
})
