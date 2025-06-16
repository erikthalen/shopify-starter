import barba from "@barba/core"
import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  isOpen: false,
  q: "",

  open() {
    setTimeout(() => {
      this.isOpen = true
      this.$refs.input?.focus({
        preventScroll: true,
      })
    })
  },

  close() {
    this.isOpen = false
    this.q = ""
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
