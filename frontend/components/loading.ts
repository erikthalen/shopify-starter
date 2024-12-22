/**
 * create and append loading-css
 */
const css = 'body.is-loading * { cursor: wait; }'
const style = document.createElement('style')
style.appendChild(document.createTextNode(css))
document.head.appendChild(style)

/**
 * listen for loading events
 */
export function setIsLoading(isLoading) {
  document.body.classList.toggle('is-loading', isLoading)
}
