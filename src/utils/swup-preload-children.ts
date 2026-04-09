import { swup } from "~/swup"

/**
 * Mimic Swup's preload plugin by adding pointerover listeners to
 * any links in the given container(s).
 * This is used to preload pages linked from any content added by Alpine Ajax.
 */

export const swupPreloadChildren = async ({
  container,
  exclude,
}: {
  container: HTMLElement | HTMLElement[]
  exclude?: string | string[]
}) => {
  // preload all links in any element appended by Alpine Ajax
  if (typeof swup.preload === "function") {
    const containers = Array.isArray(container) ? container : [container]
    const excludes =
      exclude === undefined || Array.isArray(exclude) ? exclude : [exclude]

    const linksToPreload: Element[] = containers
      .map((el: HTMLElement) => [...el.querySelectorAll("*[href]")])
      .flat()
      .filter(link => {
        return (
          !excludes ||
          !excludes.find(exclude =>
            link.getAttribute("href")?.includes(exclude)
          )
        )
      })

    if (linksToPreload.length) {
      linksToPreload.forEach(link => {
        link.addEventListener("pointerover", async () => {
          if (typeof swup.preload === "function") {
            swup.preload(window.location.origin + link.getAttribute("href"))
          }
        })
      })
    }
  }
}
