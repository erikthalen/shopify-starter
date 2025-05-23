/// <reference types="navigation-api-types" />

import "@virtualstate/navigation/polyfill"

/**
 * @function
 * @description An attempt to make the content not jump around on the screen while a page navigation is running
 */
export const fixatePageOnNavigation = ({ top = "0px" } = {}) => {
  if (!window.navigation) return

  window.navigation.addEventListener("navigate", e => {
    const scrollY = window.scrollY

    const { pathname } = new URL(e.destination.url)

    // Do not place the old page on top of the new page.
    // (page load or changing query params handled in an component)
    // To force pages to be on-top-of each other:
    // <a href="/url" x-data @click="window.forcePageRefresh = true">Link</a>
    if (!window.forcePageRefresh && window.location.pathname === pathname) {
      return
    }

    window.forcePageRefresh = false

    const container = document.querySelector("main")

    if (!container) return

    // place the old page in the place it was,
    // so it's safe to scroll to the top
    container.style.position = "fixed"
    container.style.width = "100vw"
    container.style.left = "0"
    container.style.top = `calc(-${scrollY}px + ${top})`
  })
}

console.log(
  `%c         ,
       __)\\___
   _.-'      .\`-.
 .'/~~\`\`\`"~z/~'"\` 
 ^^`,
  'color: dodgerblue; font-family: "Menlo"'
)
