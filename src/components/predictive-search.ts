import barba from "@barba/core"
import debounce from "./../utils/debounce"
import { defineComponent } from "~/utils/define"

const isSettled = debounce(async () => {}, { delay: 500, silent: true })

export default defineComponent(() => ({
  q: "",

  async handleFormSubmit() {
    const url = new URL("/search", window.location.origin)
    url.searchParams.set("q", this.q)
    barba.go(url.toString())
  },

  init() {
    // watches its parent drawer component
    this.$watch("drawerOpen", async drawerOpen => {
      if (drawerOpen) {
        this.$refs.input?.focus({ preventScroll: true })
      } else {
        await isSettled().then(() => {
          if (!(this as any).drawerOpen) this.q = ""
        })
      }
    })
  },
}))
