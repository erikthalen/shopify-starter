import barba from "@barba/core"
import debounce from "./../utils/debounce"
import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  isOpen: false,
  q: "",

  clear: debounce(async () => {}, 500),

  open() {
    setTimeout(() => {
      this.isOpen = true
      this.$refs.input?.focus({
        preventScroll: true,
      })
    })
  },

  async close() {
    this.isOpen = false

    try {
      await this.clear()

      if (!this.isOpen) {
        this.q = ""
      }
    } catch (error) {}
  },

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  },

  async handleFormSubmit() {
    const url = new URL("/search", window.location.origin)
    url.searchParams.set("q", this.q)
    barba.go(url.toString())
  },
}))
