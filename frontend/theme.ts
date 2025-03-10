import 'vite/modulepreload-polyfill'

import barba from '@barba/core'
import type { ITransitionData } from '@barba/core/dist/src/defs'
import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'

import { fixatePageOnNavigation } from '~/utils/utils'

import './components/loading'
import productForm from './components/product-form'
import cartAmount from './components/cart-amount'
import cart from './components/cart'
import filter from './components/filter'
import plp from './components/plp'
import cartNotification from './components/cart-notification'
import productRecommendations from './components/product-recommendations'

declare global {
  interface Window {
    Shopify: {
      designMode: boolean
    }
    forceNavigationRefresh: boolean
  }
}

Alpine.plugin(morph)

Alpine.store('cartAmount', cartAmount)

Alpine.data('cart', cart)
Alpine.data('cartNotification', cartNotification)
Alpine.data('filter', filter)
Alpine.data('plp', plp)
Alpine.data('productForm', productForm)
Alpine.data('productRecommendations', productRecommendations)

Alpine.start()

barba.init({
  debug: location.origin.includes('127.0.0.1'),
  prevent: () => window.Shopify.designMode,
  prefetchIgnore: '/cart',
  cacheIgnore: '/cart',
  transitions: [
    {
      name: 'slide-right',
      sync: true,
      from: {
        custom: ({ trigger }) =>
          (trigger as HTMLElement).dataset.transition === 'slide-right',
      },
      async leave({ current }) {
        return current.container.animate(
          { opacity: 0, translate: '-20px 0' },
          { duration: 400, easing: 'ease', fill: 'forwards' }
        ).finished
      },
      async enter({ next }) {
        await next.container.animate(
          [
            { opacity: 0, translate: '20px 0' },
            { opacity: 1, translate: '0 0' },
          ],
          { duration: 400, easing: 'ease', fill: 'forwards' }
        ).finished

        return
      },
    },
    {
      name: 'default',
      sync: true,
      from: {
        custom: ({ trigger }) => !(trigger as HTMLElement)?.dataset?.transition,
      },
      async leave({ current }) {
        return current.container.animate(
          { opacity: 0, translate: '0 20px' },
          { duration: 400, easing: 'ease', fill: 'forwards' }
        ).finished
      },
      async enter({ next }) {
        await next.container.animate(
          [
            { opacity: 0, translate: '0 -20px' },
            { opacity: 1, translate: '0 0' },
          ],
          { duration: 400, easing: 'ease', fill: 'forwards' }
        ).finished

        return
      },
    },
  ],
})

// bug: chrome doesn't scroll to top if new page is prefetched and cached.
barba.hooks.beforeEnter(data => {
  const { trigger } = data as ITransitionData
  if (trigger !== 'back' && trigger !== 'forward') {
    window.scrollTo(0, 0)
  }
})

barba.hooks.before(() => {
  window.dispatchEvent(new CustomEvent('window.navigation'))
})

// place the old page "where it was" on navigation/scroll
fixatePageOnNavigation()
