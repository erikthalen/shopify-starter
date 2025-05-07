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

const updateLinesDebounced = debounce<
  CartUpdateInput,
  LinesUpdateResponse | Error
>(async (body, { signal }) => {
  const response = await fetch('/cart/update.js', {
    signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return await response.json()
})

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

  async addLines(body: CartAddInput): Promise<LinesAddResponse | Error> {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const json: LinesAddResponse = await response.json()

    this.updateItemCount()

    window.dispatchEvent(new CustomEvent('cart:updated'))

    return json
  },

  async updateLines(
    body: CartUpdateInput
  ): Promise<LinesUpdateResponse | Error> {
    const response = await updateLinesDebounced(body)

    if (!(response instanceof Error)) {
      this.itemCount = response.item_count
    }

    window.dispatchEvent(new CustomEvent('cart:updated'))

    return response
  },
}

/**
 * Make the store typesafe
 */
declare module 'alpinejs' {
  interface Stores {
    cartStore: typeof cartStore
  }
}

export default cartStore
