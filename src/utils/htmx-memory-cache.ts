import type htmx from "htmx.org"
import type { HtmxRequestConfig, HtmxResponseInfo } from "htmx.org"

type Htmx = typeof htmx

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
 *  4. After each swap, resets preloadState on any [preload] elements inside
 *     the swapped target so the extension re-registers them. Morph reuses
 *     DOM nodes, so preloadState would otherwise survive and block re-init.
 */
export function initHtmxMemoryCache(htmx: Htmx) {
  const cache = new Map<string, string>()
  const blobToOriginal = new Map<string, string>()

  // Step 1 — capture preload responses
  document.addEventListener("htmx:beforeRequest", ((e: CustomEvent<HtmxResponseInfo>) => {
    if (e.detail.requestConfig?.headers?.["HX-Preloaded"] !== "true") return

    const path: string = e.detail.requestConfig.path
    if (!path || cache.has(path)) return

    // TODO: add a pending promise to the cache map.
    //       currently the preload request has to finish for it to work
    e.detail.xhr.addEventListener("load", () => {
      cache.set(path, e.detail.xhr.responseText)
    })
  }) as EventListener)

  // Step 2 — serve from memory cache via blob URL
  document.addEventListener("htmx:configRequest", ((e: CustomEvent<HtmxRequestConfig>) => {
    const path: string = e.detail.path
    if (!path || !cache.has(path)) return

    const blobUrl = URL.createObjectURL(
      new Blob([cache.get(path)!], { type: "text/html" })
    )
    blobToOriginal.set(blobUrl, path)
    e.detail.path = blobUrl
  }) as EventListener)

  // Step 3 — restore original path so hx-replace-url / hx-push-url work.
  // Must happen on htmx:beforeOnLoad, which fires just before
  // determineHistoryUpdates() reads pathInfo to compute the history URL.
  // htmx:beforeSwap fires after that computation, so it is too late.
  document.addEventListener("htmx:beforeOnLoad", ((e: CustomEvent<HtmxResponseInfo>) => {
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
  }) as EventListener)

  // Step 4 — re-initialize preload links inside swapped targets
  document.addEventListener("htmx:after-swap", ((e: CustomEvent<HtmxResponseInfo>) => {
    const target: Element = e.detail.target
    if (!target) return

    const preloadEls = target.querySelectorAll("[preload]")
    if (!preloadEls.length) return

    preloadEls.forEach(el => delete (el as any).preloadState)
    htmx.trigger(target, "htmx:afterProcessNode")
  }) as EventListener)
}
