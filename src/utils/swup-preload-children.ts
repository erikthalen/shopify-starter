import type Swup from "swup"

/**
 * Mimic Swup's preload plugin by adding pointerover listeners to
 * any links in the given container(s).
 * This is used to preload pages linked from any content added after pageload.
 */

export const swupPreloadChildren = async ({
  swup,
  container,
  exclude,
  strategy = "mouseover",
}: {
  swup: Swup
  container: HTMLElement | HTMLElement[]
  exclude?: string | string[]
  strategy?: "mouseover" | "init"
}) => {
  if (typeof swup.preload !== "function") return

  const containers = Array.isArray(container) ? container : [container]

  const excludes =
    exclude === undefined || Array.isArray(exclude) ? exclude : [exclude]

  const links: Element[] = containers
    .map(el => [...el.querySelectorAll("*[href]")])
    .flat()
    .filter(link => {
      if (!excludes) return true

      const isExcluded = excludes.find(rule =>
        link.getAttribute("href")?.includes(rule)
      )

      return !isExcluded
    })
    .filter(link => {
      return link.getAttribute("[data-no-swup]") !== null
    })

  if (links.length) {
    links.forEach(link => {
      if (strategy === "mouseover") {
        link.addEventListener("pointerover", () => preloadLink(link), {
          once: true,
        })
      }

      if (strategy === "init") {
        preloadLink(link)
      }
    })
  }

  function preloadLink(link: Element) {
    if (typeof swup.preload === "function") {
      swup.preload(window.location.origin + link.getAttribute("href"))
    }
  }
}
