import { useHydrate, useRefs } from '~/framework'
import { Component } from '~/types'
import { components } from '.'

const CART_SELECTOR = '.main-cart'

function isLoading(initiator, isLoading) {
  if (isLoading) {
    console.log(`%cStarted loading ${initiator}`, 'color: dodgerblue')
  } else {
    console.log(`%cFinished loading ${initiator}`, 'color: dodgerblue')
  }
}

/**
 * calls the passed function if not called again within [delay] ms.
 * an abortcontroller is passed to the callback, good for aborting a fetch if a new fetch is called
 */
export function debounce(
  callback: (arg: unknown, obj: { signal: AbortSignal }) => unknown,
  delay: number
  // eslint-disable-next-line
): (arg: unknown) => Promise<any | Error> {
  let abortController = null

  return arg =>
    new Promise((resolve, reject) => {
      abortController?.abort('debounced')
      abortController = new AbortController()

      const handleAbort = () => {
        clearTimeout(timeout)
        reject('debounced')
      }

      const timeout = setTimeout(async () => {
        try {
          abortController.signal?.removeEventListener('abort', handleAbort)
          resolve(await callback(arg, { signal: abortController.signal }))
        } catch (error) {
          console.log(error)
          handleAbort()
        }
      }, delay)

      abortController.signal?.addEventListener('abort', handleAbort)
    })
}

function replaceCartMarkup(
  newCart: HTMLElement,
  selector: string
): HTMLElement {
  const oldCarts = document.querySelectorAll(selector)

  oldCarts.forEach(oldCart => {
    oldCart.after(newCart.cloneNode(true))
    oldCart.remove()
  })

  return newCart
}

async function fetchCartMarkup({
  cache = true,
  signal = null,
}: {
  cache?: boolean
  signal?: AbortSignal | null
}): Promise<HTMLElement> {
  const parser = new DOMParser()
  const res = await fetch('/cart' + cache ? '?cache=false' : '', { signal })
  const text = await res.text()
  const doc = parser.parseFromString(text, 'text/html')
  const cart = doc.querySelector(CART_SELECTOR)
  return cart as HTMLElement
}

const debouncedUpdateCart: (arg: unknown) => Promise<HTMLElement> = debounce(
  async (body, { signal }) => {
    isLoading('cart-update', true)

    await fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const newCart = await fetchCartMarkup({ signal })

    isLoading('cart-update', false)

    return newCart
  },
  200
)

async function updateCart(element: HTMLElement): Promise<HTMLElement> {
  const target =
    element.tagName !== 'FORM' ? element.querySelector('form') : element

  const abortController = new AbortController()

  return new Promise(resolve => {
    async function handleRemoveItem(url) {
      isLoading('cart-will-update', true)
      await fetch(url) // call shopify with remove-request
      const newCart = await fetchCartMarkup({ cache: false })
      isLoading('cart-will-update', false)
      abortController.abort()
      resolve(replaceCartMarkup(newCart, CART_SELECTOR))
    }

    async function handleUpdateCart(input) {
      try {
        // both update cart and get new cart markup back
        const newCart = await debouncedUpdateCart({
          updates: { [input.id]: parseInt(input.value) },
        })

        abortController.abort()
        resolve(replaceCartMarkup(newCart, CART_SELECTOR))
      } catch (error) {
        console.log(error)
        isLoading('cart-will-update', false)
      }
    }

    target?.addEventListener(
      'change',
      async e => {
        const input = e.target as HTMLInputElement
        if (input.name !== 'updates[]') return
        e.preventDefault()
        e.stopPropagation()
        handleUpdateCart(input)
      },
      { signal: abortController.signal }
    )

    const links = target ? [...target.querySelectorAll('a')] : []
    const removeLinks = links.filter(link => link.href.includes('cart/change'))

    // any/all remove buttons
    removeLinks.forEach(link => {
      link.addEventListener(
        'click',
        async e => {
          e.preventDefault()
          e.stopPropagation()
          handleRemoveItem(link.href)
        },
        { signal: abortController.signal }
      )
    })
  })
}

export const cart: Component = ref => {
  if (!ref.mainCart) return

  async function updateRecursive(form) {
    const newForm = await updateCart(form)
    window.dispatchEvent(new CustomEvent('ss-event.cart.updated'))
    updateRecursive(newForm)
  }

  ref.mainCart.map(element => updateRecursive(element))
}

window.addEventListener('ss-event.cart.updated', () => {
  useHydrate(components).hydrate(useRefs())
})
