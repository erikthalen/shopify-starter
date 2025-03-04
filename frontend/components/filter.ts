import barba from '@barba/core'
import { setIsLoading } from './loading'
import { defineComponent } from '~/utils/define'

export default defineComponent(() => ({
  async handleFilterChange() {
    setIsLoading(true)

    const formData = new FormData(this.$root as HTMLFormElement)

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

    this.$root.dispatchEvent(
      new CustomEvent('filter-update', { detail: text, bubbles: true })
    )

    setIsLoading(false)
  },
}))
