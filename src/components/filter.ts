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

  updateURL() {
    const formData = new FormData(this.$root as HTMLFormElement)
    const url = new URL(window.location.pathname, window.location.origin)

    for (const [key, value] of formData) {
      url.searchParams.append(key, value.toString())
    }

    barba.history.add(url.href, "popstate", "replace")
  },
}))
