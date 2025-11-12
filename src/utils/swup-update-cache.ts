import type Swup from "swup"

export type CacheUpdateStrategy = {
  merge: "append" | "replace"
  id: string
}[]

/**
 * Injects new items loaded by infinite-scroll into swup's cache entry of the current page
 */
export function swupUpdateCache(
  swup: Swup,
  newDocument: string,
  strategy: CacheUpdateStrategy
) {
  const url = swup.getCurrentUrl()
  const cachedPage = swup.cache.get(url)

  if (!cachedPage) return

  const cachedDocument = new DOMParser().parseFromString(
    cachedPage.html,
    "text/html"
  )

  strategy.forEach(target => {
    const newTarget = new DOMParser()
      .parseFromString(newDocument, "text/html")
      .getElementById(target.id)

    const cache = cachedDocument.getElementById(target.id)

    if (target.merge === "append") {
      cache?.append(...(newTarget?.children || []))
    } else if (target.merge === "replace") {
      cache?.after(newTarget || "")
      cache?.remove()
    }
  })

  // Save the modified html as a string in the cache entry
  cachedPage.html = cachedDocument.documentElement.outerHTML

  swup.cache.update(url, cachedPage)
}
