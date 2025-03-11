import { defineComponent } from '~/utils/define'
import { setIsLoading } from './is-loading'

export default defineComponent(() => ({
  async handleFilterUpdate() {
    setIsLoading(true)

    const res = await fetch(window.location.href)
    const text = await res.text()

    const markup = new DOMParser().parseFromString(text, 'text/html')
    const newPLP = markup.querySelector('[x-data="mainCollection"]')

    setIsLoading(false)

    if (!newPLP) return

    document.startViewTransition(() => {
      this.$root.after(newPLP)
      this.$root.remove()
      // Alpine.morph(this.$root, newPLP)
    })
  },
}))
