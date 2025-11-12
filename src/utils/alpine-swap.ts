import Alpine from "alpinejs"

/**
 * @module x-swap
 *
 * @description
 * Hijacks a link and partially swaps out elements on the current page with elements from the new page.
 *
 * "x-swap" is a list of ids to swap, separated with spaces
 * If Alpine.morph is active:
 * "x-swap-skip" is a list of ids to skip, separated with spaces
 *
 * @example
 * <a
 *  href="/new-page"
 *  x-swap="section_id"
 *  @swap:loading="(e) => {}"
 *  @swap:update="(e) => {}"
 * >
 *  Click me
 * </a>
 */

const fetches = new Map()

/**
 * Adapted from the oficial Alpine.js file:
 * @see https://github.com/alpinejs/alpine/blob/main/packages/focus/src/index.js
 *
 * @param {*} Alpine The Alpine global object
 */
export default function (Alpine: Alpine.Alpine) {
  Alpine.addInitSelector(() => `[${Alpine.prefixed("swap")}]`)

  /**
   * Custom Directive
   *
   * @see https://alpinejs.dev/advanced/extending#custom-directives
   * @see https://alpinejs.dev/advanced/extending#method-signature
   * @param {string} name The name of the directive. The name "mydirective" will be consumed as x-mydirective
   * @param {*} el The DOM element the directive is added to
   * @param {*} value If provided, the part of the directive after a colon. Ex: 'bar' in x-foo:bar
   * @param {*} modifiers An array of dot-separated trailing additions to the directive. Ex: ['baz', 'lob'] from x-foo.baz.lob
   * @param {*} expression The attribute value portion of the directive. Ex: law from x-foo="law"
   * @param {*} evaluateLater The Alpine evaluateLater API
   * @param {*} effect A function to create reactive effects that will auto-cleanup after this directive is removed from the DOM
   * @param {*} cleanup A function you can pass bespoke callbacks to that will run when this directive is removed from the DOM
   */
  Alpine.directive("swap", (el, { expression }, { cleanup }) => {
    const abortController = new AbortController()

    const href = window.location.origin + el.getAttribute("href")

    const idsToSwap = expression?.split(" ") || []
    const idsToSkip =
      el.getAttribute(Alpine.prefixed("swap-skip"))?.split(" ") || []

    async function swap(link: HTMLAnchorElement) {
      dispatch(el, "swap:loading", true)

      const prefetched = fetches.get(link.href)

      const text = prefetched
        ? await prefetched
        : await prefetch(null, link.href)

      const markup = new DOMParser().parseFromString(text, "text/html")

      for (const id of idsToSwap) {
        const source = document.getElementById(id)
        const target = markup.getElementById(id)

        if (source && target) {
          /**
           * This messes up the image fade ins
           */
          if (Alpine.morph) {
            Alpine.morph(source, target.outerHTML, {
              updating: (el, _, __, skip) => {
                if (!(el instanceof HTMLElement)) return

                const id = el.getAttribute("id")

                if (id && idsToSkip.includes(id)) {
                  skip()
                }
              },
            })
          } else {
            source.outerHTML = target.outerHTML
          }
        }

        /**
         * Automatically prefetch all new urls
         */
        source?.querySelectorAll("*[href]").forEach(el => {
          const href = window.location.origin + el.getAttribute("href")

          if (href) {
            prefetch(null, href)
          }
        })
      }

      dispatch(el, "swap:loading", false)
      dispatch(el, "swap:update", link.href)
    }

    async function prefetch(e: PointerEvent | null, href?: string) {
      const target = e?.target as HTMLElement
      const url = href || (target?.closest("a") as HTMLAnchorElement)?.href

      if (!href && fetches.get(url)) return

      fetches.set(
        url,
        fetch(url).then(response => response.text())
      )

      return fetches.get(url)
    }

    async function handleClick(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()

      const link = (e.target as HTMLElement).closest("a") as HTMLAnchorElement

      try {
        await swap(link)
      } catch (error) {
        console.log(error)
        window.location.href = link.href
      }
    }

    if (href) {
      prefetch(null, href)
    }

    try {
      // el.addEventListener("pointerover", prefetch, {
      //   signal: abortController.signal,
      // })

      el.addEventListener("click", handleClick, {
        signal: abortController.signal,
      })
    } catch (error) {
      console.log(error)
    }

    cleanup(() => {
      try {
        abortController.abort()
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function dispatch<T>(el: HTMLElement, name: string, detail: T) {
  return el.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true,
    })
  )
}
