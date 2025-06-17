import barba from "@barba/core"
import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  async appendPageToCache(e: CustomEventInit) {
    const currentCache =
      barba.cache.get(barba.history.current.url) || this.createCache(e)

    const currentCacheRequest = await currentCache.request

    if (!currentCacheRequest) return

    const cachedPage = new DOMParser().parseFromString(
      currentCacheRequest.html,
      "text/html"
    )

    const targets = [
      { merge: "append", id: "paginated_items" },
      { merge: "replace", id: "pagination" },
    ]

    targets.forEach(target => {
      const newTarget = new DOMParser()
        .parseFromString(e.detail.raw, "text/html")
        .getElementById(target.id)

      const cache = cachedPage.getElementById(target.id)

      if (target.merge === "append") {
        cache?.append(...(newTarget?.children || []))
      } else if (target.merge === "replace") {
        cache?.after(newTarget || "")
        cache?.remove()
      }
    })

    barba.cache.update(barba.history.current.url, {
      ...currentCache,
      request: Promise.resolve({
        ...currentCacheRequest,
        html: cachedPage.documentElement.innerHTML,
      }),
    })
  },

  // mimics barba's functionality of adding to its cache
  createCache(e: CustomEventInit) {
    const url = new URL(barba.history.current.url)

    return barba.cache.set(
      barba.history.current.url,
      Promise.resolve({
        html: e.detail.raw,
        url: {
          hash: url.hash,
          href: url.href,
          path: url.pathname,
          port: parseInt(url.port),
          query: Object.fromEntries(url.searchParams.entries()),
        },
      }),
      "init",
      "fulfilled",
      url.href
    )
  },
}))
