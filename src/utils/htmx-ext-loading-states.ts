import type htmx from "htmx.org"

// https://github.com/bigskysoftware/htmx-extensions/blob/main/src/loading-states/README.md

type Htmx = typeof htmx

export function loadingStates(htmx: Htmx): void {
  const undoQueue: Array<() => void> = []

  function loadingStateContainer(target: Element): Element {
    return htmx.closest(target, "[data-loading-states]") ?? document.body
  }

  function mayProcessUndoCallback(target: Element, callback: () => void): void {
    if (document.body.contains(target)) {
      callback()
    }
  }

  function mayProcessLoadingStateByPath(
    elt: Element,
    requestPath: string
  ): boolean {
    const pathElt = htmx.closest(elt, "[data-loading-path]")
    if (!pathElt) return true
    return pathElt.getAttribute("data-loading-path") === requestPath
  }

  function queueLoadingState(
    sourceElt: Element,
    targetElt: Element,
    doCallback: () => void,
    undoCallback: () => void
  ): void {
    const delayElt = htmx.closest(sourceElt, "[data-loading-delay]")

    if (delayElt) {
      const delay = Number(delayElt.getAttribute("data-loading-delay")) || 200
      const timeout = setTimeout(() => {
        doCallback()
        undoQueue.push(() => mayProcessUndoCallback(targetElt, undoCallback))
      }, delay)

      undoQueue.push(() =>
        mayProcessUndoCallback(targetElt, () => clearTimeout(timeout))
      )
    } else {
      doCallback()
      undoQueue.push(() => mayProcessUndoCallback(targetElt, undoCallback))
    }
  }

  function getLoadingStateElts(
    scope: Element,
    attribute: string,
    path: string
  ): Element[] {
    const includeScopeElement =
      scope.getAttribute(attribute) !== null ? [scope] : []

    return Array.from(htmx.findAll(scope, `[${attribute}]`))
      .filter(elt => mayProcessLoadingStateByPath(elt, path))
      .concat(includeScopeElement)
  }

  function getLoadingTarget(elt: Element): Element[] {
    const selector = elt.getAttribute("data-loading-target")
    if (selector) return Array.from(htmx.findAll(selector))
    return [elt]
  }

  htmx.defineExtension("loading-states", {
    onEvent(name, evt): boolean {
      if (name === "htmx:beforeRequest") {
        const requestPath: string = (evt as CustomEvent).detail.pathInfo
          .requestPath
        const container = loadingStateContainer((evt as CustomEvent).detail.elt)

        const byType: Record<string, Element[]> = {
          "data-loading": getLoadingStateElts(
            container,
            "data-loading",
            requestPath
          ),
          "data-loading-class": getLoadingStateElts(
            container,
            "data-loading-class",
            requestPath
          ),
          "data-loading-class-remove": getLoadingStateElts(
            container,
            "data-loading-class-remove",
            requestPath
          ),
          "data-loading-disable": getLoadingStateElts(
            container,
            "data-loading-disable",
            requestPath
          ),
          "data-loading-aria-busy": getLoadingStateElts(
            container,
            "data-loading-aria-busy",
            requestPath
          ),
        }

        byType["data-loading"].forEach(sourceElt => {
          getLoadingTarget(sourceElt).forEach(targetElt => {
            queueLoadingState(
              sourceElt,
              targetElt,
              () => {
                targetElt.setAttribute(
                  "style",
                  `display:${sourceElt.getAttribute("data-loading") ?? "inline-block"}`
                )
              },
              () => {
                targetElt.setAttribute("style", "display:none")
              }
            )
          })
        })

        byType["data-loading-class"].forEach(sourceElt => {
          const classes = (
            sourceElt.getAttribute("data-loading-class") ?? ""
          ).split(" ")
          getLoadingTarget(sourceElt).forEach(targetElt => {
            queueLoadingState(
              sourceElt,
              targetElt,
              () => classes.forEach(c => targetElt.classList.add(c)),
              () => classes.forEach(c => targetElt.classList.remove(c))
            )
          })
        })

        byType["data-loading-class-remove"].forEach(sourceElt => {
          const classes = (
            sourceElt.getAttribute("data-loading-class-remove") ?? ""
          ).split(" ")
          getLoadingTarget(sourceElt).forEach(targetElt => {
            queueLoadingState(
              sourceElt,
              targetElt,
              () => classes.forEach(c => targetElt.classList.remove(c)),
              () => classes.forEach(c => targetElt.classList.add(c))
            )
          })
        })

        byType["data-loading-disable"].forEach(sourceElt => {
          getLoadingTarget(sourceElt).forEach(targetElt => {
            queueLoadingState(
              sourceElt,
              targetElt,
              () => {
                ;(targetElt as HTMLButtonElement).disabled = true
              },
              () => {
                ;(targetElt as HTMLButtonElement).disabled = false
              }
            )
          })
        })

        byType["data-loading-aria-busy"].forEach(sourceElt => {
          getLoadingTarget(sourceElt).forEach(targetElt => {
            queueLoadingState(
              sourceElt,
              targetElt,
              () => targetElt.setAttribute("aria-busy", "true"),
              () => targetElt.removeAttribute("aria-busy")
            )
          })
        })
      }

      if (name === "htmx:beforeOnLoad") {
        while (undoQueue.length > 0) undoQueue.shift()!()
      }

      return true
    },
  })
}
