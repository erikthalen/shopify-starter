import Alpine, { type AlpineComponent } from 'alpinejs'
import barba from '@barba/core'
import { Product, Variant } from '~/types'
import { setIsLoading } from './loading'

type AddToCartData = {
  items: {
    id: number
    quantity: number
  }[]
}

type ProductFormComponent = (
  initialVariantAvailable: boolean,
  parser?: 'default'
) => {
  productData: Product | null
  currentVariant: Variant | { available: boolean }

  parser: (form: HTMLFormElement, productData: Product) => AddToCartData

  init: () => Promise<void>
  handleChange: (e: Event) => void
  handleSubmit: (e: Event) => void
}

const productForm: AlpineComponent<ProductFormComponent> = (
  initialVariantAvailable,
  parser
) => ({
  productData: null,
  currentVariant: { available: initialVariantAvailable },

  parser: parser === 'default' ? defaultParser : pdpParser,

  async init() {
    const getData = async () => {
      const res = await fetch(window.location.pathname + '.js')
      this.productData = await res.json()
    }

    if (parser !== 'default') {
      try {
        getData()
      } catch (error) {
        console.log(error)
      }
    }
  },

  handleChange(e) {
    const form = (e.target as HTMLElement).closest('form')
    const id = this.parser(form, this.productData).items[0].id
    const url = new URL(window.location.href)

    if (id === null) {
      url.searchParams.delete('variant')
    } else {
      url.searchParams.set('variant', id)
    }

    barba.history.add(url.href, 'popstate', 'replace')

    if (this.productData && id) {
      this.currentVariant = this.productData.variants.find(
        variant => variant.id === parseInt(id.toString())
      )
    }
  },

  async handleSubmit(e) {
    const form = (e.target as HTMLElement).closest('form')
    const data = this.parser(form, this.productData)

    setIsLoading(true)

    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const res = await fetch('/cart.json')
      const json = await res.json()

      Alpine.store('cartAmount', { amount: json.item_count })
    } catch (error) {
      console.log(`Couldn't add to card: `, error)
    }

    setIsLoading(false)
  },
})

function pdpParser(form, productData) {
  const formData = new FormData(form)
  const formValues = Object.fromEntries(formData.entries())

  const variant =
    formValues.id ||
    productData.variants.find(variant => {
      return variant.options.every((value, idx) => {
        const optionName = productData.options[idx].name
        return formValues[optionName] === value
      })
    })?.id

  const quantity = parseInt(formData.get('quantity').toString() || '1')

  return {
    items: [{ id: variant, quantity }],
  }
}

function defaultParser(form) {
  const formData = new FormData(form)
  const [id] = formData.getAll('id')
  const quantity = parseInt(formData.getAll('quantity').toString() || '1')

  console.log(id, quantity)

  return {
    items: [{ id, quantity }],
  }
}

export default productForm
