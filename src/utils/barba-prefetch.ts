import barba from "@barba/core"

export function barbaPrefetch() {
  document.querySelectorAll("a").forEach(link => {
    if (
      link.getAttribute("data-barba-prefetch") !== null &&
      !barba.cache.get(link.href)
    ) {
      barba.prefetch(link.href)
    }
  })
}
