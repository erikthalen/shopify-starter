import { useRefs, useHydrate } from './../framework'
import useALaCart from '~/modules/a-la-cart'
import { components } from '~/components'

async function fetchCartAmount() {
  try {
    const res = await fetch('/cart.js')
    const json = await res.json()
    if (json?.item_count !== undefined) return json.item_count

    throw 'did not receive amount from shopify :('
  } catch (error) {
    window.location.reload()
    return ''
  }
}

// update text label indicating current amount in cart
export const cartItemCount = ref => {
  if (!ref.cartItemCount) return

  // use markup like:
  // <span data-ref="cart-item-count">{{ cart.item_count }}</span>

  async function updateAmount(e) {
    const amountFromEvent = e.detail?.items?.reduce(
      (acc, cur) => (acc += cur.quantity),
      0
    )
    const amount = amountFromEvent || (await fetchCartAmount())

    ref.cartItemCount.forEach(el => (el.textContent = amount))
  }

  window.addEventListener('a-la-cart.product-added', updateAmount)
  window.addEventListener('a-la-cart.cart-updated', updateAmount)
}

// handle cart opening/closing
export default ref => {
  if (!ref.cartContainer) return

  const [cartContainer] = ref.cartContainer

  function hydrateCart() {
    try {
      const refs = useRefs({ root: cartContainer, asArray: true })

      useALaCart({
        useBarbaNavigation: true,
        drawerContainer: cartContainer, // '[data-cart-drawer-content]',
        cartSectionSelector: 'main',
      })

      useHydrate(components).hydrate(refs)

      // refs.closeButton[0]?.addEventListener('click', () => {
      //   const cartContent = document.querySelector(
      //     '[data-shopify-content]'
      //   ) as HTMLElement
      //   cartContent.style.opacity = '0'

      //   setTimeout(() => {
      //     window.dispatchEvent(new CustomEvent('a-la-cart.close-drawer'))
      //   }, 150)
      // })
    } catch (error) {
      console.log('could not open cart')
      window.location.reload()
    }
  }

  window.addEventListener('click', (e) => {
    if(!cartContainer.contains(e.target)) {
      window.dispatchEvent(new CustomEvent('a-la-cart.close-drawer'))
    }
  })

  window.addEventListener('a-la-cart.drawer-opened', hydrateCart)
  window.addEventListener('a-la-cart.cart-updated', hydrateCart)

  window.addEventListener('a-la-cart.product-added', () => {
    window.dispatchEvent(new CustomEvent('a-la-cart.open-drawer'))
  })

  function setLoadingState(e) {
    const isLoading = e.detail
    const form = cartContainer.querySelector('form')
    form.style.opacity = isLoading ? '0.5' : null
  }

  window.addEventListener('a-la-cart.is-updating', setLoadingState)

  // close on backdrop click
  // cartContainer.addEventListener('click', e => {
  //   if (e.target.closest('[data-cart-drawer-content]')) return

  //   const drawer = cartContainer.querySelector('[data-shopify-content]')
  //   console.log(cartContainer)

  //   drawer.style.transition = 'opacity 150ms'
  //   drawer.style.opacity = '0'

  //   setTimeout(() => {
  //     window.dispatchEvent(new CustomEvent('a-la-cart.close-drawer'))
  //   }, 150)
  // })
}
