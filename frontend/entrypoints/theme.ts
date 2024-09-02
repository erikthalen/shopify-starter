import 'vite/modulepreload-polyfill'
import '@virtualstate/navigation/polyfill'
import barba from '@barba/core'
import {
  useHydrate,
  useRefs,
  useTransition,
  createDevGrid,
  createBarbaScrollPersist,
  pageTransition,
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

function runExternalModules(container = document.body) {
  useALaCart({
    root: container,
    useBarbaNavigation: true,
    drawerContainer: refs.cartContainer[0],
    // drawerContainer: '[data-cart-drawer-content]',
    cartSectionSelector: 'main',
  })
}

// used for removing all "old" event listeners after page shift
// note: this is maybe only necessary when listening on window-events?
//       browsers seems to be smart enough to removeEventListeners automatically
//       when an element is removed from the dom(?)
let abortController = null
const refreshAbortController = () => {
  abortController?.abort()
  abortController = new AbortController()
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
        refreshAbortController()
        pageTransitions.pageLoad()
        globalComponents.hydrate(refs)
        pageComponents.hydrate(refs, { signal: abortController.signal })
        runExternalModules(document.body)
      },
      before() {
        window.dispatchEvent(new CustomEvent('window.navigation'))
      },
      leave() {
        refreshAbortController()
      },
      enter({ current, next }) {
        refs = useRefs({ exclude: current.container, asArray: true })
        pageComponents.hydrate(refs)
        runExternalModules(next.container)

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
