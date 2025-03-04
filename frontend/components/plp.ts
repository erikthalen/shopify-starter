import { defineComponent } from '~/utils/define'

export default defineComponent(() => ({
  handleFilterUpdate(e: CustomEvent<string>) {
    const parser = new DOMParser()
    const markup = parser.parseFromString(e.detail, 'text/html')
    const newPLP = markup.querySelector('[x-data="plp"]')

    if (!newPLP) return

    document.startViewTransition(() => {
      this.$root.after(newPLP)
      this.$root.remove()
      // Alpine.morph(this.$root, newPLP)
    })
  },
}))
