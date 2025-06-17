import barba from "@barba/core"
import debounce from "./../utils/debounce"
import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  isOpen: false,
  q: "",

  isClosed: debounce(async () => {}, { delay: 500, silent: true }),

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

    await this.isClosed().then(() => {
      if (!this.isOpen) this.q = ""
    })
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
