import barba from '@barba/core'
import debounce from '~/utils/debounce'
import { defineComponent } from '~/utils/define'

export default defineComponent(() => ({
  results: '',
  q: '',

  handleNavigation() {
    this.results = ''
    this.q = ''
  },

  async handleFormInput(e: InputEvent) {
    const target = e.target as HTMLInputElement
    const formData = new FormData(target.form as HTMLFormElement)

    this.q = formData.get('q')?.toString() || ''

    if (!this.q) return

    try {
      const url = new URL('/search/suggest', window.location.origin)

      url.searchParams.set('q', this.q)
      url.searchParams.set('section_id', 'predictive-search-results')

      const res = await debounceFetch(url.toString())
      const text = await res.text()

      // const searchUrl = new URL('/search', window.location.origin)
      // searchUrl.searchParams.set('q', this.q)
      // barba.prefetch(searchUrl.toString())

      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/html')
      const results = doc.querySelector<HTMLElement>(
        '.predictive-search-results'
      )

      if (results) {
        this.results = results.outerHTML
      }
    } catch (error) {
      console.warn(error)
    }
  },

  async handleFormSubmit(e: SubmitEvent) {
    const url = new URL('/search', window.location.origin)
    url.searchParams.set('q', this.q)

    barba.go(url.toString())
  },
}))

const debounceFetch = debounce<string, Response>(async (url, { signal }) => {
  return await fetch(url, { signal })
})
