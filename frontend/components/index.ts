import { useRefs, pageTransition } from './../framework'
import cart, { cartItemCount } from './cart'

// add all components that only needs to be initialized once
export const globals = [
  cart,
  cartItemCount,
  () => console.log('Global Component 1 hydrated'),
  ref => {
    if (!ref.cartNotification) return

    window.addEventListener('a-la-cart.product-added', (e: CustomEvent) => {
      ref.cartNotification[0].querySelector('.content').innerHTML =
        JSON.stringify(e.detail, null, 2)
      ref.cartNotification[0].classList.add('active')

      setTimeout(() => {
        ref.cartNotification[0].classList.remove('active')
      }, 3000)
    })
  },
]

// add all components that needs to be initialized after every page shift
export const components = [
  async () => {
    await pageTransition.finished
    console.log('Component 1 hydrated')
  },
  ref => {
    console.log('Component 2 hydrated, with refs: ', ref)
    return () => console.log('Component 2 dehydrated')
  },
  ref => {
    if (!ref.testSection) return

    ref.testSection.forEach(item => {
      const refs = useRefs({ root: item, namespaced: true })
      console.log(refs)

      refs.button.addEventListener('click', () => {
        history.pushState({}, null, location.href + 'hejjja')
      })
    })
  },
  ref => {
    if (!ref.closeDrawer) return

    ref.closeDrawer[0].addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('a-la-cart.close-drawer'))
    })
  },
]
