import 'vite/modulepreload-polyfill'
import barba from '@barba/core'
import {
  useHydrate,
  useRefs,
  useTransition,
  createDevGrid,
  createBarbaScrollPersist,
  dolphin,
} from '~/framework'
import * as pageTransitions from '~/transitions'
import { globals, components } from '~/components'

dolphin()

// visit ?grid to show visual grid
createDevGrid({
  cols: 12,
  bleed: 'var(--grid-bleed, 32px)',
  gap: 'var(--grid-gap, 16px)',
})

// persist scroll position across navigation
createBarbaScrollPersist()

let refs = useRefs({ asArray: true })
const globalComponents = useHydrate(globals)
const pageComponents = useHydrate(components)

let abortController = null

const refreshAbortController = () => {
  abortController?.abort()
  abortController = new AbortController()
}

barba.init({
  // debug: location.origin.includes('127.0.0.1'),
  prevent: () => (window as any).Shopify.designMode,
  prefetchIgnore: '/cart',
  cacheIgnore: '/cart',
  transitions: useTransition({
    page: pageTransitions,
    global: {
      once() {
        refreshAbortController()
        globalComponents.hydrate(refs)
        pageComponents.hydrate(refs, { signal: abortController.signal })
      },
      before() {
        refreshAbortController()
        window.dispatchEvent(new CustomEvent('window.navigation'))
      },
      enter({ current, next }) {
        refs = useRefs({ exclude: current.container, asArray: true })
        pageComponents.hydrate(refs, { signal: abortController.signal })

        // if there for some reason are <script>'s that need to run in the new <main>
        next.container.querySelectorAll('script').forEach(script => {
          const tag = document.createElement('script')
          tag.innerHTML = script.innerHTML
          script.after(tag)
          script.remove()
        })
      },
    },
  }),
})
