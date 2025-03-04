import Alpine from 'alpinejs'
import barba from '@barba/core'
import { ProductData, VariantData } from '~/types'
import { setIsLoading } from './loading'
import { defineComponent } from '~/utils/define'

type AddToCartData = {
  items: {
    id: number
    quantity: number
  }[]
}

type ProductFormParser = (
  form: HTMLFormElement,
  productData: ProductData
) => AddToCartData | null

export default defineComponent<{
  productData: ProductData | null
  currentVariant: VariantData | { available: boolean }
  parser: ProductFormParser
}>((initialVariantAvailable: boolean, parser: 'default') => ({
  productData: null,
  currentVariant: { available: initialVariantAvailable },

  parser: parser === 'default' ? defaultParser : pdpParser,

  async init() {
    if (parser !== 'default') {
      try {
        const res = await fetch(window.location.pathname + '.js')
        this.productData = await res.json()
      } catch (error) {
        console.log(error)
      }
    }
  },

  handleChange(e: Event) {
    const form = (e.target as HTMLElement).closest('form')

    if (!form || !this.productData) return

    const id = this.parser(form, this.productData)?.items[0].id
    const url = new URL(window.location.href)

    if (!id || id === null) {
      url.searchParams.delete('variant')
    } else {
      url.searchParams.set('variant', id.toString())
    }

    barba.history.add(url.href, 'popstate', 'replace')

    if (id) {
      const newVariant = this.productData.variants.find(
        variant => variant.id === id
      )

      this.currentVariant = newVariant || { available: false }
    }
  },

  async handleSubmit(e: SubmitEvent) {
    const form = (e.target as HTMLElement).closest('form')

    if (!form || !this.productData) return

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
}))

function pdpParser(form: HTMLFormElement, productData: ProductData) {
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

  const quantity = parseInt(formData.get('quantity')?.toString() || '1')

  if (!variant) return null

  return {
    items: [{ id: parseInt(variant.toString()), quantity }],
  }
}

function defaultParser(form: HTMLFormElement) {
  const formData = new FormData(form)
  const [id] = formData.getAll('id')
  const quantity = parseInt(formData.getAll('quantity').toString() || '1')

  return {
    items: [{ id: parseInt(id.toString()), quantity }],
  }
}
