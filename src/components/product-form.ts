import barba from '@barba/core'
import { ProductData, VariantData } from '~/types'
import { setIsLoading } from './is-loading'
import { defineComponent } from '~/utils/define'
import Alpine from 'alpinejs'

const pdpParser = (form: HTMLFormElement, productData?: ProductData) => {
  if (!productData) return

  const formData = new FormData(form)
  const formValues = Object.fromEntries(formData.entries())

  const id =
    formValues.id ||
    productData.variants.find(variant => {
      return variant.options.every((value, idx) => {
        const { name } = productData.options[idx]
        return formValues[name] === value
      })
    })?.id

  if (!id) return

  return {
    id: parseInt(id.toString()),
    quantity: parseInt(formData.get('quantity')?.toString() || '1'),
  }
}

const defaultParser = (form: HTMLFormElement) => {
  const formData = new FormData(form)
  const [id] = formData.getAll('id')
  const quantity = parseInt(formData.getAll('quantity').toString() || '1')

  return {
    id: parseInt(id.toString()),
    quantity,
  }
}

export default defineComponent(
  (initialVariantAvailable: boolean, parserType: 'simple') => ({
    productData: undefined as ProductData | undefined,

    currentVariant: { available: initialVariantAvailable } as
      | VariantData
      | undefined,

    parser: parserType === 'simple' ? defaultParser : pdpParser,

    async init() {
      if (parserType !== 'simple') {
        try {
          const res = await fetch(window.location.pathname + '.js')
          this.productData = await res.json()
          console.log(this.productData)
        } catch (error) {
          console.log(error)
        }
      }
    },

    handleChange(e: Event) {
      const form = (e.target as HTMLElement).closest('form')

      if (!form || !this.productData) return

      const data = this.parser(form, this.productData)

      this.currentVariant = this.productData.variants.find(
        variant => variant.id === data?.id
      )

      this.updateURL()
    },

    async handleSubmit(e: SubmitEvent) {
      const form = (e.target as HTMLElement).closest('form')

      if (!form) return

      const data = this.parser(form, this.productData)

      if (!data) return

      setIsLoading(true)

      await Alpine.store('cartStore')
        .addLines({ items: [data] })
        .catch(() => {})

      setIsLoading(false)
    },

    updateURL() {
      const { id } = this.currentVariant || {}
      const url = new URL(window.location.href)

      if (!id) {
        url.searchParams.delete('variant')
      } else {
        url.searchParams.set('variant', id.toString())
      }

      barba.history.add(url.href, 'popstate', 'replace')
    },
  })
)
