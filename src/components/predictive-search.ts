import barba from '@barba/core'
import debounce from '~/utils/debounce'
import { defineComponent } from '~/utils/define'

export default defineComponent(() => ({
  abortController: new AbortController(),

  isOpen: false,

  results: '',
  q: '',

  open() {
    setTimeout(() => {
      this.isOpen = true
      this.$refs.input.focus({
        preventScroll: true,
      })
    })
  },

  close() {
    this.isOpen = false
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

      const res = await debouncedFetch(url.toString())
      const text = await res.text()

      const doc = new DOMParser().parseFromString(text, 'text/html')
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

  async handleFormSubmit() {
    const url = new URL('/search', window.location.origin)
    url.searchParams.set('q', this.q)

    barba.go(url.toString())
  },

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  },

  // init() {
  //   window.addEventListener('predictive-search:toggle', () => this.toggle(), {
  //     signal: this.abortController.signal,
  //   })
  // },

  // destroy() {
  //   this.abortController.abort()
  // },
}))

const debouncedFetch = debounce<string, Response>(async (url, { signal }) => {
  return fetch(url, { signal })
})
