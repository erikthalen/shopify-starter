import Alpine from 'alpinejs'
import { setIsLoading } from './is-loading'
import { defineComponent } from '~/utils/define'

export default defineComponent((sectionName: string) => ({
  abortController: new AbortController(),

  async handleQuantityChange(e: Event) {
    const el = e.target as HTMLInputElement

    setIsLoading(true)

    await Alpine.store('cartStore')
      .updateLines({
        updates: { [el.id]: parseInt(el.value) },
      })
      .catch(() => {})

    setIsLoading(false)
  },

  async handleRemove(e: PointerEvent) {
    const target = e.target as HTMLAnchorElement

    if (!target || target.tagName !== 'A') {
      console.log(
        'The element has to be an <a href="{{ item.url_to_remove }}">'
      )
      return
    }

    setIsLoading(true)

    const url = new URL(target.href)
    const param = url.searchParams.get('id')
    const id = param?.split(':')[0]

    if (!id) return

    await Alpine.store('cartStore')
      .updateLines({
        updates: { [id]: 0 },
      })
      .catch(() => {})

    setIsLoading(false)
  },

  async render() {
    const response = await fetch(`?section_id=${sectionName}`)
    const text = await response.text()

    const cart = new DOMParser()
      .parseFromString(text, 'text/html')
      .querySelector(`[x-data='cart("${sectionName}")']`)

    if (!cart) return

    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => {
        if (cart?.innerHTML) {
          this.$root.innerHTML = cart?.innerHTML
        }
      })
    } else {
      if (cart?.innerHTML) {
        this.$root.innerHTML = cart?.innerHTML
      }
    }
  },

  init() {
    window.addEventListener('cart:updated', () => this.render(), {
      signal: this.abortController.signal,
    })
  },

  destroy() {
    this.abortController.abort()
  },
}))
