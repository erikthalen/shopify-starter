import Alpine from "alpinejs"

/**
 * @module x-sync-params
 *
 * @description
 * Updates the browser url with a forms current values
 *
 * @example
 * <form x-data x-sync-params>
 *  <input type="number" name="number" value="1">
 * </form>
 */
export default function (Alpine: Alpine.Alpine) {
  Alpine.directive("sync-params", (el, {}, { cleanup }) => {
    const abortController = new AbortController()

    function updateURL() {
      const formData = new FormData(el as HTMLFormElement)
      const url = new URL(window.location.pathname, window.location.origin)

      for (const [key, value] of formData) {
        url.searchParams.append(key, value.toString())
      }

      window.history.replaceState(null, "", url.href)
    }

    el.addEventListener("change", updateURL, {
      signal: abortController.signal,
    })

    cleanup(() => {
      abortController.abort()
    })
  })
}
