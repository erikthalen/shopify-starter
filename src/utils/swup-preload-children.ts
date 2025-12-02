import { swup } from "~/swup"

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

    const allHrefsInAppendedElement: string[] = containers
      .map((el: HTMLElement) => {
        const elementsWithHref = [...el.querySelectorAll("*[href]")]
        return elementsWithHref.map(
          el => window.location.origin + el.getAttribute("href")
        )
      })
      .flat()
      .filter(
        (href: string) =>
          !excludes || !excludes.find(exclude => href.includes(exclude))
      )

    if (allHrefsInAppendedElement.length) {
      await swup.preload(allHrefsInAppendedElement)
    }
  }
}
