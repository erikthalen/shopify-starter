import { AlpineComponent } from 'alpinejs'
import barba from '@barba/core'
import { setIsLoading } from './loading'

type FilterComponent = () => {
  handleFilterChange: (e: Event) => void
}

const filter: AlpineComponent<FilterComponent> = () => ({
  async handleFilterChange() {
    setIsLoading(true)

    const formData = new FormData(this.$root)

    const url = new URL(window.location.pathname, window.location.origin)

    for (const [key, value] of formData) {
      url.searchParams.append(key, value.toString())
    }

    barba.history.add(url.href, 'popstate', 'replace')

    const searchUrl = new URL(window.location.pathname, window.location.origin)

    for (const [key, value] of formData) {
      searchUrl.searchParams.set(key, value.toString())
    }

    const res = await fetch(searchUrl)
    const text = await res.text()

    this.$root.dispatchEvent(new CustomEvent('filter-update', { detail: text, bubbles: true }))

    setIsLoading(false)
  },
})

export default filter
