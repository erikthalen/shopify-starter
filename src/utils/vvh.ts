/**
 * viewportHandler
 * supplies a css custom variable "--vvh" that corresponds to the
 * visible viewport, inside any browser ui and keyboard.
 */
window.visualViewport?.addEventListener("resize", viewportHandler)

viewportHandler()

function viewportHandler() {
  document.body.style.setProperty("--vvh", window.visualViewport?.height + "px")
}
