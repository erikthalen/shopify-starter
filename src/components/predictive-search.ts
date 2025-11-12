import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  q: "",

  async onSubmit() {
    if (!window.swup) return

    const url = new URL("/search", window.location.origin)
    url.searchParams.set("q", this.q)
    window.swup.navigate(url.toString())
  },
}))
