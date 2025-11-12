import { swup } from "~/swup"
import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  q: "",

  async onSubmit() {
    if (!swup) return

    const url = new URL("/search", window.location.origin)
    url.searchParams.set("q", this.q)

    swup.navigate(url.toString())
  },
}))
