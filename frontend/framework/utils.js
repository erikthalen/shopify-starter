/**
 * @function createDevGrid
 * @description Appends some fixed divs to the `<body>`, which are styled to look like a grid.
 * @param {{ cols: number, bleed: string, gap: string, color: string }} [options] - changes the appearance of the grid
 */
export const createDevGrid = ({
  cols = 12,
  bleed = '32px',
  gap = '16px',
  color = '210 100% 56%',
} = {}) => {
  if (!location.search.includes('grid')) return

  const container = document.createElement('div')

  container.style.setProperty('--helper-color', color)
  container.style.setProperty('--cols', cols.toString())
  container.style.setProperty('--bleed', bleed.toString())
  container.style.setProperty('--gap', gap.toString())

  Object.assign(container.style, {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    zIndex: '100000000',
    top: '0',
    left: '0',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: 'repeat(var(--cols), 1fr)',
    padding: '0 var(--bleed)',
    gap: 'var(--gap)',
    pointerEvents: 'none',
    userSelect: 'none',
  })

  for (let i = 0; i < parseInt(cols); i++) {
    const column = document.createElement('div')
    column.textContent = i + 1

    Object.assign(column.style, {
      color: 'hsla(var(--helper-color) / 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      background: 'hsla(var(--helper-color) / 0.05)',
      borderInline: '1px solid hsla(var(--helper-color) / 0.4)',
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

  let pageLoad = true

  window.navigation.addEventListener('navigate', () => {
    const scrollY = window.scrollY

    if (pageLoad) {
      pageLoad = false
      return
    }

    const container = document.querySelector('main')

    // place the old page in the place it was,
    // so it's safe to scroll to the top
    container.style.position = 'fixed'
    container.style.width = '100vw'
    container.style.left = '0'
    container.style.top = -scrollY + 'px'
  })
}
