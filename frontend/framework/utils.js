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

  for (let i = 0; i < parseInt(cols); i++) {
    const column = document.createElement('div')
    column.textContent = i + 1

    Object.assign(column.style, {
      color: `hsla(${color} / 0.4)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      background: `hsla(${color} / 0.05)`,
      borderInline: `1px solid hsla(${color} / 0.4)`,
    })

    container.append(column)
  }

  document.body.append(container)
}

/**
 * @function
 * @description An attempt to make the content not jump around on the screen while a page navigation is running
 */
export const createBarbaScrollPersist = () => {
  /**
   * polyfill: @virtualstate/navigation
   */
  if (!window.navigation) return

  window.navigation.addEventListener('navigate', e => {
    const scrollY = window.scrollY
    const { pathname } = new URL(e.destination.url)

    // bail if the new page is the old page (page load or changing query params)
    if (window.location.pathname === pathname) return

    const container = document.querySelector('main')

    // place the old page in the place it was,
    // so it's safe to scroll to the top
    container.style.position = 'fixed'
    container.style.width = '100vw'
    container.style.left = '0'
    container.style.top = -scrollY + 'px'
  })
}
