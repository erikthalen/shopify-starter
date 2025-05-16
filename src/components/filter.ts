import barba from "@barba/core"
import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  isOpen: false,

  open() {
    setTimeout(() => (this.isOpen = true))
  },

  close() {
    this.isOpen = false
  },

  async render() {
    const response = await fetch(window.location.href)
    const text = await response.text()
    const markup = new DOMParser()
      .parseFromString(text, "text/html")
      .querySelector('[x-data="filter"]')

    if (markup) {
      this.$root.innerHTML = markup?.innerHTML
    }
  },

  async handleFilterChange(e?: Event) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const url = this.updateURL()

    this.render()

    this.$root.dispatchEvent(
      new CustomEvent("filter:update", { detail: url, bubbles: true })
    )
  },

  updateURL() {
    const formData = new FormData(this.$root as HTMLFormElement)
    const url = new URL(window.location.pathname, window.location.origin)

    for (const [key, value] of formData) {
      url.searchParams.append(key, value.toString())
    }

    barba.history.add(url.href, "popstate", "replace")
  },
}))
