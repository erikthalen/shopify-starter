import barba from "@barba/core"

export function barbaPrefetch() {
  document.querySelectorAll("a").forEach(link => {
    // is not a prefetch link
    if (link.getAttribute("data-barba-prefetch") === null) {
      return
    }

    // is not an internal link
    if (
      !link.href?.startsWith("/") &&
      !link.href?.startsWith(window.location.origin)
    ) {
      return
    }

    // is already prefetched/cached
    if (barba.cache.get(link.href)) {
      return
    }

    barba.prefetch(link.href)
  })
}
