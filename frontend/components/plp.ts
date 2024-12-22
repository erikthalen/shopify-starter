import Alpine, { AlpineComponent } from 'alpinejs'

type PLPComponent = () => {
  handleFilterUpdate: (e: CustomEvent) => void
}

const plp: AlpineComponent<PLPComponent> = () => ({
  handleFilterUpdate(e) {
    const parser = new DOMParser()
    const markup = parser.parseFromString(e.detail, 'text/html')
    const newPLP = markup.querySelector('[x-data="plp"]')

    document.startViewTransition(() => {
      this.$root.after(newPLP)
      this.$root.remove()
      // Alpine.morph(this.$root, newPLP)
    })
  },
})

export default plp
