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

barba.init({
  debug: location.origin.includes('127.0.0.1'),
  prevent: () => (window as any).Shopify.designMode,
  transitions: useTransition({
    page: {
      defaultTransition
    },
    global: {
      once() {
        globalComponents.hydrate(refs)
        pageComponents.hydrate(refs)
      },
      leave() {
        useEvent.dispatch(events.window.navigation)
        useEvent.dehydrate()
      },
      enter({ current }) {
        refs = useRefs({ exclude: current.container, asArray: true })
        pageComponents.hydrate(refs)
      },
    },
  }),
})
