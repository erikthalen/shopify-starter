import 'vite/modulepreload-polyfill'

import barba from '@barba/core'
import type { ITransitionData } from '@barba/core/dist/src/defs'
import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'

import useTransition from '~/utils/use-transition'
import { fixatePageOnNavigation, dolphin } from '~/utils/utils'

import cartAmount from './components/cart-amount'
import cartNotification from './components/cart-notification'
import cart from './components/cart'
import filter from './components/filter'
import './components/is-loading'
import mainCollection from './components/main-collection'
import predictiveSearch from './components/predictive-search'
import productForm from './components/product-form'
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

Alpine.data('cartNotification', cartNotification)
Alpine.data('cart', cart)
Alpine.data('filter', filter)
Alpine.data('mainCollection', mainCollection)
Alpine.data('predictiveSearch', predictiveSearch)
Alpine.data('productForm', productForm)
Alpine.data('productRecommendations', productRecommendations)

Alpine.start()

barba.init({
  debug: location.origin.includes('127.0.0.1'),
  prevent: () => window.Shopify.designMode,
  prefetchIgnore: '/cart',
  cacheIgnore: '/cart',
  transitions: useTransition({
    page: {
      default: {
        async leave({ current }: ITransitionData) {
          const options = {
            duration: 600,
            easing: 'ease',
            fill: 'forwards' as FillMode,
          }
          const to = { opacity: 0, translate: '0 20px' }

          return current.container.animate(to, options).finished
        },

        async enter({ next }: ITransitionData) {
          const options = {
            duration: 600,
            easing: 'ease',
            fill: 'forwards' as FillMode,
          }
          const from = { opacity: 0, translate: '0 -20px' }
          const to = { opacity: 1, translate: '0 0' }

          return next.container.animate([from, to], options).finished
        },
      },
    },
    global: {
      before() {
        window.dispatchEvent(new CustomEvent('window-navigation'))
      },
    },
  }),
})

// place the old page "where it was" on navigation/scroll
fixatePageOnNavigation()

dolphin()
