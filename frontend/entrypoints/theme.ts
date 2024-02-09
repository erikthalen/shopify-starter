import 'vite/modulepreload-polyfill'

// vite-thing: auto-import all css files
Object.values(import.meta.glob('~/css/**/*.css')).forEach(cssFileImport => cssFileImport())

import '~/framework/dev-grid.css'
import barba from '@barba/core'

import {
  useEvent,
  useHydrate,
  useRefs,
  useTransition,
  setDefaultTransition,
} from '~/framework'
import transitions from '~/transitions'
import { globals, components } from '~/components'
import events from '~/events'

const __devmode = location.hostname.includes('127.0.0.1')

let refs = useRefs({ asArray: true })

const hydration = useHydrate(components).hydrate(refs)

useHydrate(globals).hydrate(refs)
setDefaultTransition('default')

window.history.scrollRestoration = 'manual'

const scrollPositions = []

barba.init({
  prevent: () => (window as any).Shopify.designMode,
  transitions: useTransition({
    transitions,
    globals: {
      once() {
        console.log('page was loaded by barba')
      },

      beforeLeave({ current, trigger }) {
        // handle scroll scrollRestoration
        const { scrollY } = window
        scrollPositions.push(scrollY)

        // place the old page in the place it was,
        // so it's safe to scroll to the top
        current.container.style.position = 'fixed'
        current.container.style.width = '100vw'
        current.container.style.left = 0
        current.container.style.top = -scrollY + 'px'

        const navigatingBack = ['popstate', 'back', 'forward'].includes(trigger)
        window.scrollTo({ top: navigatingBack ? scrollPositions.at(-2) : 0 })
      },

      leave() {
        refs = null
        useEvent.dispatch(events.window.navigation)
        useEvent.dehydrate()
      },

      enter({ current }) {
        current.container.classList.add('old-page')
        refs = useRefs({ exclude: '.old-page', asArray: true })
        hydration.hydrate(refs, __devmode)
      },
    },
  }),
})
