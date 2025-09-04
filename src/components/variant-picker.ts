import { defineComponent } from "~/utils/define"

const fetches = new Map()

export default defineComponent(() => ({
  abortController: new AbortController(),

  isLoading: false,

  async swap(link: HTMLAnchorElement) {
    this.isLoading = true

    const prefetched = fetches.get(link.href)

    const text = prefetched
      ? await prefetched
      : await this.prefetch(null, link.href)

    const markup = new DOMParser().parseFromString(text, "text/html")

    // swap target form
    if (this.$root.dataset.swapTarget) {
      const source = document.getElementById(this.$root.dataset.swapTarget)
      const target = markup.getElementById(this.$root.dataset.swapTarget)

      if (!source || !target) {
        window.location.reload()
      } else {
        source.innerHTML = target?.innerHTML
      }
    }

    // swap itself
    const source = document.getElementById(this.$root.id)
    const target = markup.getElementById(this.$root.id)

    if (!source || !target) {
      window.location.reload()
    } else {
      source.outerHTML = target?.outerHTML
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
    this.$root.querySelectorAll("a").forEach(link => {
      link.addEventListener("pointerover", this.prefetch.bind(this), {
        signal: this.abortController.signal,
      })

      link.addEventListener("click", this.handleClick.bind(this), {
        signal: this.abortController.signal,
      })
    })
  },

  destroy() {
    this.abortController.abort()
  },
}))
