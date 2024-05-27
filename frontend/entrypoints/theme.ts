import 'vite/modulepreload-polyfill'
import "@virtualstate/navigation/polyfill"
import barba from '@barba/core'
import {
  useEvent,
  useHydrate,
  useRefs,
  useTransition,
  createDevGrid,
  createBarbaScrollPersist
} from '~/framework'
import * as pageTransitions from '~/transitions'
import { globals, components } from '~/components'
import useALaCart from '~/modules/a-la-cart'

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

function runExternalModules() {
  useALaCart({ useBarbaNavigation: true })
}

barba.init({
  debug: location.origin.includes('127.0.0.1'),
  prevent: () => (window as any).Shopify.designMode,
  prefetchIgnore: '/cart',
  cacheIgnore: '/cart',
  transitions: useTransition({
    page: pageTransitions,
    global: {
      once() {
        globalComponents.hydrate(refs)
        pageComponents.hydrate(refs)
        runExternalModules()
      },
      leave() {
        useEvent.dispatch('window.navigation')
        useEvent.dehydrate()
      },
      enter({ current, next }) {
        refs = useRefs({ exclude: current.container, asArray: true })
        pageComponents.hydrate(refs)
        runExternalModules()

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