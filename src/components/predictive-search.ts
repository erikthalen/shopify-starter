import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  q: "",

  init() {
    this.$watch("q", q => {
      if (q !== "") return

      // abort an in-flight request so its response can't fill the results again
      this.$refs.predictiveSearchForm.dispatchEvent(new Event("htmx:abort"))
      this.$refs.predictiveSearchResults.replaceChildren()
    })
  },

  suggest(term: string) {
    this.q = term
    this.$refs.input.focus()
    // wait for x-model to sync the hidden form's input before submitting it
    this.$nextTick(() => this.search())
  },

  search() {
    if (this.q === "") return
    ;(this.$refs.predictiveSearchForm as HTMLFormElement).requestSubmit()
  },
}))
