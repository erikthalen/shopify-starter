import { defineComponent } from '~/utils/define'

type Props = {
  url: string
  sectionId: string
  productId: string
  limit: number
  intent: 'related' | 'complementary'
}

export default defineComponent(
  ({ url, sectionId, productId, limit, intent }: Props) => ({
    url,
    sectionId,
    productId,
    limit,
    intent,

    result: '',

    async init() {
      try {
        const url = new URL(this.url, window.location.origin)

        url.searchParams.set('section_id', this.sectionId)
        url.searchParams.set('product_id', this.productId)
        url.searchParams.set('limit', this.limit.toString())
        url.searchParams.set('intent', this.intent)

        const res = await fetch(url)
        const text = await res.text()
        const markup = new DOMParser().parseFromString(text, 'text/html')

        if (!markup) return

        this.result = markup.querySelector('ul')?.outerHTML || ''
      } catch (error) {
        console.log('cound not load recommendations', error)
      }
    },
  })
)
