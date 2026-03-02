import Alpine from "alpinejs"
import { createHistoryRecord, updateHistoryRecord } from "swup"

/**
 * @module x-sync-params
 *
 * @description
 * Updates the browser history with a forms current values.
 * Can either use "pushState" or "replaceState", defaults to "pushState"
 *
 * @example
 * <form x-data x-sync-params>
 *  <input type="number" name="number" value="1">
 * </form>
 *
 * <form x-data x-sync-params.replace>
 *  <input type="number" name="number" value="1">
 * </form>
 */
export default function (Alpine: Alpine.Alpine) {
  Alpine.directive("sync-params", (el, { modifiers }, { cleanup }) => {
    const abortController = new AbortController()

    const possibleStrategies = ["push", "replace"]

    const [strategy = possibleStrategies[0]] = modifiers

    if (!possibleStrategies.includes(strategy)) {
      console.warn(
        `[x-sync-data]\nModifier must be one of ["${possibleStrategies.join('", "')}"], received: "${strategy}"`
      )
    }

    function updateURL(reset: boolean = false) {
      const formData = new FormData(el as HTMLFormElement)
      const url = new URL(window.location.pathname, window.location.origin)

      if (reset !== true) {
        for (const [key, value] of formData) {
          url.searchParams.append(key, value.toString())
        }
      }

      if (strategy === "push") createHistoryRecord(url.href)
      if (strategy === "replace") updateHistoryRecord(url.href)

      window.dispatchEvent(
        new CustomEvent("sync-params:update", { detail: url })
      )
    }

    try {
      el.addEventListener("input", () => updateURL(), {
        signal: abortController.signal,
      })
      el.addEventListener("reset", () => updateURL(true), {
        signal: abortController.signal,
      })
    } catch (error) {
      console.log(error)
    }

    cleanup(() => {
      try {
        abortController.abort()
      } catch (error) {
        console.log(error)
      }
    })
  })
}
