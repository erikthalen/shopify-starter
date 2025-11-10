import barba from "@barba/core"

export function barbaPrefetch() {
  if (barba.cacheIgnore === true || barba.prefetchIgnore === true) {
    return
  }

  document.querySelectorAll("*[href]").forEach(link => {
    const href = link.getAttribute("href")

    if (!href) return

    // is not a barba link
    if (link.getAttribute("data-barba-prevent") !== null) {
      return
    }

    const cacheIgnore = Array.isArray(barba.cacheIgnore)
      ? barba.cacheIgnore
      : [barba.cacheIgnore]

    if (
      cacheIgnore.find(
        ignore => typeof ignore === "string" && href.includes(ignore)
      )
    ) {
      return
    }

    const prefetchIgnore = Array.isArray(barba.prefetchIgnore)
      ? barba.prefetchIgnore
      : [barba.prefetchIgnore]

    if (
      prefetchIgnore.find(
        ignore => typeof ignore === "string" && href.includes(ignore)
      )
    ) {
      return
    }

    // is not an internal link
    if (!href?.startsWith("/") && !href?.startsWith(window.location.origin)) {
      return
    }

    // is already prefetched/cached
    if (barba.cache.get(href)) {
      return
    }

    barba.prefetch(href)
  })
}
