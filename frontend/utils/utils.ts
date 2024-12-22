import '@virtualstate/navigation/polyfill'

/**
 * @function
 * @description An attempt to make the content not jump around on the screen while a page navigation is running
 */
export const fixatePageOnNavigation = ({ top = '0px' } = {}) => {
  /**
   * polyfill: @virtualstate/navigation
   */

  if (!window.navigation) return
  window.navigation.addEventListener('navigate', e => {
    const scrollY = window.scrollY

    const { pathname } = new URL(e.destination.url)

    // bail if the new page is the old page (page load or changing query params)
    // EXCEPT for when the window.forceNavigationRefresh is set to true..
    if (
      !window.forceNavigationRefresh &&
      window.location.pathname === pathname
    ) {
      return
    }

    const container = document.querySelector('main')

    // place the old page in the place it was,
    // so it's safe to scroll to the top
    container.style.position = 'fixed'
    container.style.width = '100vw'
    container.style.left = '0'
    container.style.top = `calc(-${scrollY}px + ${top})`

    // reset
    window.forceNavigationRefresh = false
  })
}

export const dolphin = () =>
  console.log(
    `%c         ,
       __)\\___
   _.-'      .\`-.
 .'/~~\`\`\`"~z/~'"\` 
 ^^`,
    'color: dodgerblue; font-family: "Menlo"'
  )
