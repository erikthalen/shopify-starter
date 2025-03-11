import Alpine from 'alpinejs'
import { setIsLoading } from './is-loading'
import debounce from '~/utils/debounce'
import { defineComponent } from '~/utils/define'

const updateCart = debounce<HTMLInputElement, Element | null | undefined>(
  async (el, { signal }) => {
    const { id, value } = el

    setIsLoading(true)

    try {
      const res = await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: { [id]: parseInt(value) },
        }),
      })

      const json = await res.json()

      Alpine.store('cartAmount', { amount: json.item_count })

      // get new cart markup
      const res2 = await fetch('/cart', { signal })
      const cartMarkup = await res2.text()
      const markup = new DOMParser().parseFromString(cartMarkup, 'text/html')
      const newCartSectionMarkup = markup.querySelector('[x-data="cart"]')

      setIsLoading(false)

      return newCartSectionMarkup
    } catch (error) {
      setIsLoading(false)
    }
  }
)

export default defineComponent(() => ({
  async handleQuantityChange(e: Event) {
    const el = e.target as HTMLInputElement

    try {
      const newCartMarkup = await updateCart(el)

      // update was debounced
      if (!newCartMarkup) return

      document.startViewTransition(() => {
        Alpine.morph(this.$root, newCartMarkup, {})
      })

      // adjust input values
      // (bug in Alpine.morph?)
      const newInputs = [...newCartMarkup.querySelectorAll('input')]
      const inputs = this.$root.querySelectorAll('input')
      inputs.forEach((input: HTMLInputElement) => {
        const target = newInputs.find(i => i.id === input.id)

        if (!target) return

        input.value = target.value
      })
    } catch (error) {
      console.log(error)
    }
  },

  async handleRemove(e: PointerEvent) {
    const target = e.target as HTMLAnchorElement

    if (!target || target.tagName !== 'A') {
      console.log('The remove-button has to be an <a href="url/to/remove">')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(target.href)
      const text = await res.text()
      const markup = new DOMParser().parseFromString(text, 'text/html')
      const element = markup.querySelector('[x-data="cart"]')

      document.startViewTransition(() => {
        if (!element) return
        Alpine.morph(this.$root, element, {})
      })

      const res2 = await fetch('/cart.json')
      const json = await res2.json()

      Alpine.store('cartAmount', { amount: json.item_count })
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  },
}))
