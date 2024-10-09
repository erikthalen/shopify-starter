import '@virtualstate/navigation/polyfill'

/**
 * @function createDevGrid
 * @description Appends some fixed divs to the `<body>`, which are styled to look like a grid.
 * @param {object} [options] - Options object
 * @param {number} [options.cols] - Amount of columns
 * @param {string} [options.bleed] - Horizontal space outside the grid
 * @param {string} [options.gap] - Horizontal space between columns
 * @param {string} [options.color] - A CSS-hsl string defining the color of the grid
 */
export const createDevGrid = ({
  cols = 12,
  bleed = '32px',
  gap = '16px',
  color = '210 100% 56%',
} = {}) => {
  if (!location.search.includes('grid')) return

  const container = document.createElement('div')
  container.classList.add('dev-grid')

  Object.assign(container.style, {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    zIndex: '100000000',
    top: '0',
    left: '0',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    padding: `0 ${bleed}`,
    gap: gap,
    pointerEvents: 'none',
    userSelect: 'none',
  })

  for (let i = 0; i < parseInt(cols.toString()); i++) {
    const column = document.createElement('div')
    column.textContent = (i + 1).toString()

    Object.assign(column.style, {
      color: `hsla(${color} / 0.4)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      background: `hsla(${color} / 0.05)`,
      borderInline: `0.5px solid hsla(${color} / 0.4)`,
    })

    container.append(column)
  }

  document.body.append(container)
}

/**
 * @function
 * @description An attempt to make the content not jump around on the screen while a page navigation is running
 */
export const createBarbaScrollPersist = ({ top = '0px' } = {}) => {
  /**
   * polyfill: @virtualstate/navigation
   */

  if (!(window as any).navigation) return
  ;(window as any).navigation.addEventListener('navigate', e => {
    const scrollY = window.scrollY

    const { pathname } = new URL(e.destination.url)

    // bail if the new page is the old page (page load or changing query params)
    // EXCEPT for when the window.navigationRefresh is set to true..
    if (
      !(window as any).navigationRefresh &&
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
    ;(window as any).navigationRefresh = false
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
