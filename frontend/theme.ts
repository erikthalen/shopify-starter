import 'vite/modulepreload-polyfill'

import barba from '@barba/core'
import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'

import useTransition from '~/utils/use-transition'
import { fixatePageOnNavigation, dolphin } from '~/utils/utils'

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
      designMode: unknown
    }
    forceNavigationRefresh: boolean
    navigation: unknown
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
  transitions: useTransition({
    page: {
      default: {
        async leave({ current }) {
          const options = {
            duration: 400,
            easing: 'ease',
            fill: 'forwards',
          }
          const to = { opacity: 0, translate: '0 20px' }

          return current.container.animate(to, options).finished
        },

        async enter({ next }) {
          const options = {
            duration: 400,
            easing: 'ease',
            fill: 'forwards',
          }
          const from = { opacity: 0, translate: '0 -20px' }
          const to = { opacity: 1, translate: '0 0' }

          return next.container.animate([from, to], options).finished
        },
      },
    },
    global: {
      before() {
        window.dispatchEvent(new CustomEvent('window.navigation'))
      },
    },
  }),
})

// place the old page "where it was" on navigation/scroll
fixatePageOnNavigation()

dolphin()
