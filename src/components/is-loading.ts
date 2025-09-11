/**
 * create and append loading-css
 */
const css = "body.is-loading * { cursor: wait; }"
const style = document.createElement("style")
style.appendChild(document.createTextNode(css))
document.head.appendChild(style)

/**
 * listen for loading events
 */
window.addEventListener("app:loading", (e: CustomEventInit) => {
  document.body.classList.toggle("is-loading", e.detail)
})
