import type { AlpineComponent } from 'alpinejs'

type Props = {
  url: string
  sectionId: string
  productId: string
  limit: number
  intent: 'related' | 'complementary'
}

type ProductRecommendationsComponent = (Props) => {
  url: string
  result: string
  init: () => void
}

const productRecommendations: AlpineComponent<
  ProductRecommendationsComponent
> = ({ url, sectionId, productId, limit, intent }) => ({
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
      url.searchParams.set('limit', this.limit)
      url.searchParams.set('intent', this.intent)

      const res = await fetch(url)
      const text = await res.text()
      const parser = new DOMParser()
      const markup = parser.parseFromString(text, 'text/html')
      
      this.result = markup.querySelector('ul').outerHTML
    } catch (error) {
      console.log('cound not load recommendations', error)
    }
  },
})

export default productRecommendations
