import { Cart, VariantData } from '~/types'
import debounce from '~/utils/debounce'

type CartAddInput = {
  sections?: string | string[]
  items: {
    id: number
    quantity: number
  }[]
}

type ID = number | string
type Quantity = number

type CartUpdateInput = {
  sections?: string | string[]
  updates: Record<ID, Quantity>
}

type LinesAddResponse = VariantData & {
  sections: Record<string, string>
}

type LinesUpdateResponse = Cart & {
  sections: Record<string, string>
}

const updateLinesDebounced = debounce<CartUpdateInput, LinesUpdateResponse>(
  async (body, { signal }) => {
    const response = await fetch('/cart/update.js', {
      signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    return await response.json()
  }
)

const cartStore = {
  itemCount: undefined as number | undefined,

  setItemCount(count: number) {
    this.itemCount = count
  },

  async updateItemCount() {
    const response = await fetch('/cart.js')
    const json = await response.json()
    this.itemCount = json.item_count
  },

  async addLines(body: CartAddInput) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const json: LinesAddResponse = await response.json()

    // if (!json.sections['api-cart-amount']) {
    //   console.warn(
    //     `Create a section named "api-cart-amount.liquid" with the content of {{ cart.item_count }}`
    //   )
    // } else {
    //   const itemCount = new DOMParser()
    //     .parseFromString(json.sections['api-cart-amount'], 'text/html')
    //     .querySelector('.shopify-section')?.textContent

    //   if (typeof itemCount === 'string') {
    //     this.itemCount = parseInt(itemCount)
    //   }
    // }

    this.updateItemCount()

    window.dispatchEvent(new CustomEvent('cart:updated'))

    return json
  },

  async updateLines(body: CartUpdateInput) {
    const response = await updateLinesDebounced(body)

    this.itemCount = response.item_count

    window.dispatchEvent(new CustomEvent('cart:updated'))

    return response
  },
}

// Declare uiStore as an Alpine store module
declare module 'alpinejs' {
  interface Stores {
    cartStore: typeof cartStore
  }
}

export default cartStore
