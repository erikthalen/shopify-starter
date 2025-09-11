import barba from "@barba/core"
import Alpine from "alpinejs"
import { defineComponent } from "~/utils/define"

/**
 * Swap link
 * When the lick is clicked, the href is fetched,
 * what ever ids are defined as data-swap-ids (separated with a space) are swapped.
 * Resulting in a partial update of the page.
 *
 * @example
 * <a href="/cart" data-swap-ids="cart product_form">Click me</a>
 */

const fetches = new Map()

export default defineComponent(() => ({
  abortController: new AbortController(),

  idsToSwap: [] as string[],
  idsToSkip: [] as string[],

  isLoading: false,

  async swap(link: HTMLAnchorElement) {
    this.isLoading = true

    const prefetched = fetches.get(link.href)

    const text = prefetched
      ? await prefetched
      : await this.prefetch(null, link.href)

    const markup = new DOMParser().parseFromString(text, "text/html")

    for (const id of this.idsToSwap) {
      const source = document.getElementById(id)
      const target = markup.getElementById(id)

      if (source && target) {
        Alpine.morph(source, target.outerHTML, {
          updating: (el, toEl, childrenOnly, skip) => {
            if (!(el instanceof HTMLElement)) return

            const id = el.getAttribute("id")

            if (id && this.idsToSkip.includes(id)) {
              skip()
            }
          },
        })
      }
    }

    this.updateURL(link.href)

    this.isLoading = false
  },

  async prefetch(e: PointerEvent | null, href?: string) {
    const target = e?.target as HTMLElement
    const url = href || (target?.closest("a") as HTMLAnchorElement)?.href

    if (!href && fetches.get(url)) return

    fetches.set(
      url,
      fetch(url).then(response => response.text())
    )

    return fetches.get(url)
  },

  async handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const target = e.target as HTMLElement

    await this.swap(target.closest("a") as HTMLAnchorElement)
  },

  updateURL(url: string) {
    barba.history.add(url, "popstate", "replace")
  },

  init() {
    this.idsToSwap = this.$root.dataset.swapIds?.split(" ") || []
    this.idsToSkip = this.$root.dataset.skipIds?.split(" ") || []

    this.$root.addEventListener("pointerover", this.prefetch.bind(this), {
      signal: this.abortController.signal,
    })

    this.$root.addEventListener("click", this.handleClick.bind(this), {
      signal: this.abortController.signal,
    })
  },

  destroy() {
    this.abortController.abort()
  },
}))
