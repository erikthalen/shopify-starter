import barba from "@barba/core"
import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  q: "",

  async onSubmit() {
    const url = new URL("/search", window.location.origin)
    url.searchParams.set("q", this.q)
    barba.go(url.toString())
  },
}))
