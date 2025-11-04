// just get rid of ts errors
type NavigationEventMock = {
  destination: {
    url: string
  }
}

/**
 * @function
 * @description An attempt to make the content not jump around on the screen while a page navigation is running
 */
export const fixatePageOnNavigation = ({ top = "0px" } = {}) => {
  function fixate(element: HTMLElement | null) {
    if (!element) return

    const scrollY = window.scrollY

    // place the old page in the place it was,
    // so it's safe to scroll to the top
    element.style.position = "fixed"
    element.style.width = "100vw"
    element.style.left = "0"
    element.style.top = `calc(-${scrollY}px + ${top})`
  }

  if (!window.navigation) {
    window.addEventListener("window:navigation", () => {
      fixate(document.querySelector("main"))
    })
  } else {
    window.navigation.addEventListener("navigate", (e: NavigationEventMock) => {
      const { pathname } = new URL(e.destination.url)

      // Do not place the old page on top of the new page.
      // (page load or changing query params handled in an component)
      // To force pages to be on-top-of each other:
      // <a href="/url" x-data @click="window.forcePageRefresh = true">Link</a>
      if (!window.forcePageRefresh && window.location.pathname === pathname) {
        return
      }

      window.forcePageRefresh = false

      fixate(document.querySelector("main"))
    })
  }
}

console.log(
  `%c         ,
       __)\\___
   _.-'      .\`-.
 .'/~~\`\`\`"~z/~'"\` 
 ^^`,
  'color: dodgerblue; font-family: "Menlo"'
)
