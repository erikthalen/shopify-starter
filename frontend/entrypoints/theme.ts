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

import { defaultTransition } from '~/transitions'
import { globals, components } from '~/components'
import events from '~/events'

// visit ?grid to show visual grid
createDevGrid()

// persist scroll position across navigation
createBarbaScrollPersist()

let refs = useRefs({ asArray: true })

useHydrate(globals).hydrate(refs)

const hydration = useHydrate(components).hydrate(refs)

barba.init({
  prevent: () => (window as any).Shopify.designMode,
  transitions: useTransition({
    transitions: {
      defaultTransition
    },
    globals: {
      once() {
        useEvent.dispatch(events.window.load)
      },
      leave() {
        useEvent.dispatch(events.window.navigation)
        useEvent.dehydrate()
      },
      enter({ current }) {
        current.container.classList.add('old-page')
        refs = useRefs({ exclude: '.old-page', asArray: true })
        hydration.hydrate(refs)
      },
    },
  }),
})
