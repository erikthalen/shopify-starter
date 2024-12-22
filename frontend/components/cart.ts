import Alpine, { type AlpineComponent } from 'alpinejs'
import { setIsLoading } from './loading'
import debounce from '~/utils/debounce'

type CartComponent = () => {
  handleQuantityChange: (e: Event) => void
}

const updateCart = debounce<HTMLElement>(
  async (el: HTMLInputElement, { signal }): Promise<HTMLElement> => {
    const { id, value } = el

    setIsLoading(true)

    try {
      /**
       * update cart
       */
      const res = await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: { [id]: parseInt(value) },
        }),
      })

      const json = await res.json()

      Alpine.store('cartAmount', { amount: json.item_count })

      /**
       * get new cart markup
       */
      const res2 = await fetch('/cart', { signal })
      const cartMarkup = await res2.text()
      const parser = new DOMParser()
      const markup = parser.parseFromString(cartMarkup, 'text/html')
      const newCartSectionMarkup = markup.querySelector('[x-data="cart"]')

      setIsLoading(false)

      return newCartSectionMarkup
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
)

const cart: AlpineComponent<CartComponent> = () => ({
  async handleQuantityChange(e) {
    const el = e.target as HTMLInputElement

    try {
      const newCartMarkup = await updateCart(el)

      // update was debounced
      if (!newCartMarkup) return

      document.startViewTransition(() => {
        Alpine.morph(this.$root, newCartMarkup)
      })

      /**
       * adjust input values
       * (bug in Alpine.morph?)
       */
      const newInputs = [...newCartMarkup.querySelectorAll('input')]
      const inputs = this.$root.querySelectorAll('input')
      inputs.forEach(input => {
        const target = newInputs.find(i => i.id === input.id)
        input.value = target.value
      })
    } catch (error) {
      console.log(error)
    }
  },

  async handleRemove(e) {
    setIsLoading(true)

    try {
      const res = await fetch(e.target.href)
      const text = await res.text()
      const parser = new DOMParser()
      const markup = parser.parseFromString(text, 'text/html')
      const element = markup.querySelector('[x-data="cart"]')

      document.startViewTransition(() => {
        Alpine.morph(this.$root, element)
      })

      const res2 = await fetch('/cart.json')
      const json = await res2.json()

      Alpine.store('cartAmount', { amount: json.item_count })
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  },
})

export default cart
