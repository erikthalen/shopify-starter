import Swup from "swup"
import SwupA11yPlugin from "@swup/a11y-plugin"
import SwupPreloadPlugin from "@swup/preload-plugin"

export const swup = new Swup({
  animationSelector: false,
  linkToSelf: "navigate",
  plugins: [new SwupA11yPlugin(), new SwupPreloadPlugin()],
})
