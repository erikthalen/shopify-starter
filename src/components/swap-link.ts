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
        source.innerHTML = target?.innerHTML
      }
    }

    this.isLoading = false
  },

  async prefetch(e: PointerEvent | null, href?: string) {
    const url = href || (e?.target as HTMLAnchorElement)?.href

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

    await this.swap(e.target as HTMLAnchorElement)
  },

  init() {
    this.idsToSwap = this.$root.dataset.swapIds?.split(" ") || []

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
