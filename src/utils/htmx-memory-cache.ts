/**
 * Client-side memory cache for htmx requests.
 *
 * The htmx-ext-preload extension fires requests early but relies on the
 * browser's HTTP cache to serve the response on the actual navigation.
 * Without Cache-Control headers the browser won't cache, so this utility
 * stores responses in a JS Map instead.
 *
 * How it works:
 *  1. Captures responses from preload requests (identified by the
 *     HX-Preloaded header the extension adds) and stores them.
 *  2. When an actual htmx request is about to fire for a cached URL,
 *     replaces the request path with a blob URL containing the cached
 *     HTML. The XHR resolves instantly from memory with no network round-trip.
 *  3. Restores the original path in pathInfo before the swap so that
 *     hx-replace-url / hx-push-url push the correct URL to history.
 */
export function initHtmxMemoryCache() {
  const cache = new Map<string, string>()
  const blobToOriginal = new Map<string, string>()

  // Step 1 — capture preload responses
  document.addEventListener("htmx:beforeRequest", (e: CustomEventInit) => {
    if (e.detail.requestConfig?.headers?.["HX-Preloaded"] !== "true") return

    const path: string = e.detail.requestConfig.path
    if (!path || cache.has(path)) return

    // TODO: add a pending promise to the cache map.
    //       currently the preload request has to finish for it to work
    e.detail.xhr.addEventListener("load", () => {
      cache.set(path, e.detail.xhr.responseText)
    })
  })

  // Step 2 — serve from memory cache via blob URL
  document.addEventListener("htmx:configRequest", (e: CustomEventInit) => {
    const path: string = e.detail.path
    if (!path || !cache.has(path)) return

    const blobUrl = URL.createObjectURL(
      new Blob([cache.get(path)!], { type: "text/html" })
    )
    blobToOriginal.set(blobUrl, path)
    e.detail.path = blobUrl
  })

  // Step 3 — restore original path so hx-replace-url / hx-push-url work.
  // Must happen on htmx:beforeOnLoad, which fires just before
  // determineHistoryUpdates() reads pathInfo to compute the history URL.
  // htmx:beforeSwap fires after that computation, so it is too late.
  document.addEventListener("htmx:beforeOnLoad", (e: CustomEventInit) => {
    const info = e.detail.pathInfo
    if (!info) return

    const blobUrl: string = info.requestPath
    const original = blobToOriginal.get(blobUrl)
    if (!original) return

    info.requestPath = original
    info.finalRequestPath = original
    info.responsePath = original

    URL.revokeObjectURL(blobUrl)
    blobToOriginal.delete(blobUrl)
  })
}
