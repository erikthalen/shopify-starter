import 'vite/modulepreload-polyfill'
import barba from '@barba/core'
import {
  useHydrate,
  useRefs,
  useTransition,
  createDevGrid,
  fixatePageOnNavigation,
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

// place the old page "where it was" on navigation/scroll
fixatePageOnNavigation()

let refs = useRefs()
const globalComponents = useHydrate(globals)
const pageComponents = useHydrate(components)

let abortController = null

const refreshAbortController = () => {
  abortController?.abort()
  abortController = new AbortController()
  return abortController.signal
}

barba.init({
  debug: location.origin.includes('127.0.0.1'),
  prevent: () => window.Shopify.designMode,
  prefetchIgnore: '/cart',
  cacheIgnore: '/cart',
  transitions: useTransition({
    page: pageTransitions,
    global: {
      once() {
        globalComponents.hydrate(refs)
        pageComponents.hydrate(refs, { signal: refreshAbortController() })
      },
      before() {
        window.dispatchEvent(new CustomEvent('window.navigation'))
      },
      enter({ current }) {
        refs = useRefs({ exclude: current.container })
        pageComponents.hydrate(refs, { signal: refreshAbortController() })
      },
    },
  }),
})
