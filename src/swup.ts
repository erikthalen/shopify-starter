import Swup from "swup"
import SwupDebugPlugin from "@swup/debug-plugin"
import SwupA11yPlugin from "@swup/a11y-plugin"
import SwupPreloadPlugin from "@swup/preload-plugin"

export default new Swup({
  skipPopStateHandling: (e) => {
    console.log('[skipPopStateHandling]', e)
    return false
  },
  animationSelector: false,
  linkToSelf: "navigate",
  plugins: [
    new SwupDebugPlugin(),
    new SwupA11yPlugin(),
    new SwupPreloadPlugin(),
  ],
})
