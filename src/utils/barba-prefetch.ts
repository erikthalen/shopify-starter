import barba from "@barba/core"

export function barbaPrefetch() {
  document.querySelectorAll("*[href]").forEach(link => {
    const href = link.getAttribute("href")

    if (!href) return

    // is not a prefetch link
    if (link.getAttribute("data-barba-prefetch") === null) {
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
