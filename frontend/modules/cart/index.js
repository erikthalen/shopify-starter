import barba from '@barba/core'

let settings = {
  cartSectionFileName: 'main-cart',
}

function debounce(callback, delay) {
  let abortController = null

  return arg =>
    new Promise((resolve, reject) => {
      // abort any previous call to debounce
      abortController?.abort('debounced')
      abortController = new AbortController()

      const handleAbort = () => {
        clearTimeout(timeout)
        reject('debounced')
      }

      let timeout = setTimeout(async () => {
        try {
          // no new calls to debounce was made,
          // cleanup the current abort controller
          abortController.signal?.removeEventListener('abort', handleAbort)
          // run the callback!
          resolve(await callback(arg, { signal: abortController.signal }))
        } catch (error) {
          handleAbort()
        }
      }, delay)

      // cancel pending callback, and reject the previous promise
      abortController.signal?.addEventListener('abort', handleAbort)
    })
}

function dispatchLoadingEvent(loadingState) {
  window.dispatchEvent(
    new CustomEvent('cart.is-updating', { detail: loadingState })
  )
}

const debouncedUpdateCartFetch = debounce(async (body, { signal }) => {
  dispatchLoadingEvent(true)

  // post to shopify to update cart
  const res = await fetch('/cart/update.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // signal,
    body: JSON.stringify(body),
  })

  // get markup of updated cart
  const cartSection = await fetch(
    `/?sections=${settings.cartSectionFileName}&cache=false`,
    { signal }
  )
  const cartResult = await cartSection.json()

  const parser = new DOMParser()
  const markup = parser.parseFromString(
    cartResult[settings.cartSectionFileName],
    'text/html'
  )

  dispatchLoadingEvent(false)

  return markup
}, 400)

function updateCartOnCartChange(cartSelector, cartForm) {
  const cartChangeAbortController = new AbortController()

  function replaceOldCartMarkupWithNew(newCart) {
    const oldCart = document.body.querySelector(cartSelector)
    const newCartContainer = newCart.querySelector(cartSelector)

    // switch out old markup with new
    oldCart.after(newCartContainer)
    oldCart.remove()

    return newCartContainer
  }

  return new Promise(resolve => {
    cartForm.addEventListener(
      'change',
      async e => {
        if (e.target.name === 'updates[]') {
          try {
            // both update cart and get new cart markup back
            const newCart = await debouncedUpdateCartFetch({
              updates: { [e.target.id]: parseInt(e.target.value) },
            })

            const newCartContainer = replaceOldCartMarkupWithNew(newCart)

            cartChangeAbortController.abort()
            resolve(newCartContainer)
          } catch (error) {
            dispatchLoadingEvent(false)
          }
        }
      },
      { signal: cartChangeAbortController.signal }
    )

    const links = [...cartForm.querySelectorAll('a')]

    // any/all remove buttons
    links
      .filter(link => link.href.includes('cart/change'))
      .forEach(link => {
        link.addEventListener(
          'click',
          async e => {
            e.preventDefault()

            dispatchLoadingEvent(true)

            const res = await fetch(link.href)
            const text = await res.text()

            const parser = new DOMParser()
            const newCart = parser.parseFromString(text, 'text/html')

            const newCartContainer = replaceOldCartMarkupWithNew(newCart)

            dispatchLoadingEvent(false)

            cartChangeAbortController.abort()
            resolve(newCartContainer)
          },
          { signal: cartChangeAbortController.signal }
        )
      })
  })
}

/*
 * hopefully barba 2.10.0 will clear up this mess
 */
function updateUrlOnVariantChange(productForm) {
  productForm.addEventListener('change', e => {
    if (e.target.name === 'id') {
      const url = new URL(window.location.href)
      url.searchParams.set('variant', e.target.value)

      // window.history.replaceState({}, null, url)

      barba.history.add(url.href, 'popstate', 'replace')
      barba.history.remove()
    }
    console.log('CHANGE', e.target.name)
  })
}

async function commitAddToCart(data) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    window.dispatchEvent(
      new CustomEvent('cart.product-added', { detail: json })
    )
  } catch (error) {
    console.log(`Couldn't add to card: `, error)
  }
}

async function fetchAndOpenDrawerCart(cartSelector, drawerContainer) {
  const res = await fetch('/cart')
  const text = await res.text()
  const parser = new DOMParser()
  const markup = parser.parseFromString(text, 'text/html')
  const cart = markup.querySelector(cartSelector)
  drawerContainer.append(cart)

  // runs itself again, when the markup changes
  async function rehydrateOnUpdate(cartForm) {
    const newCartForm = await updateCartOnCartChange(
      cartSelector,
      cartForm
    )
    rehydrateOnUpdate(newCartForm)
  }

  rehydrateOnUpdate(cart.querySelector('form'))
}

let cartAbortController = null

export default async ({
  cartSectionFileName = 'main-cart',
  cartSelector = '.main-cart',
  productFormSelector = '.shopify-product-form',
  productFormParser, // https://shopify.dev/docs/api/ajax/reference/cart
  drawerContainer = document.body,
} = {}) => {
  // set global settings
  settings.cartSectionFileName = cartSectionFileName

  const cartSection = document.querySelector(cartSelector)
  const productForm = document.querySelector(productFormSelector)

  // remove any old loading listeners
  cartAbortController?.abort()
  cartAbortController = new AbortController()

  if (drawerContainer) {
    const url = new URL(window.location)

    if (url.searchParams.has('cart')) {
      fetchAndOpenDrawerCart(cartSelector, drawerContainer)
    }

    const cartLink = document.querySelector('a[href="/cart"]')
    cartLink.addEventListener(
      'click',
      e => {
        e.preventDefault()
        e.stopPropagation()
        fetchAndOpenDrawerCart(cartSelector, drawerContainer)
        const url = new URL(window.location)
        url.searchParams.set('cart', '')
        window.history.replaceState({}, null, url.href)
      },
      { signal: cartAbortController.signal }
    )
  }

  if (cartSection) {
    const cartForm = cartSection.querySelector('form')

    // runs itself again, when the markup changes
    async function rehydrateOnUpdate(cartForm) {
      const newCartForm = await updateCartOnCartChange(
        cartSelector,
        cartForm
      )
      rehydrateOnUpdate(newCartForm)
    }

    rehydrateOnUpdate(cartForm)
  }

  if (productForm) {
    updateUrlOnVariantChange(productForm)

    productForm.addEventListener(
      'submit',
      async e => {
        e.preventDefault()
        function defaultParser(form) {
          const formData = new FormData(form)
          const [id] = formData.getAll('id')
          const quantity = parseInt(formData.getAll('quantity'))

          return {
            items: [{ id, quantity }],
          }
        }

        const data =
          typeof productFormParser === 'function'
            ? productFormParser(e.target)
            : defaultParser(e.target)

        await commitAddToCart(data)
      },
      {
        signal: cartAbortController.signal,
      }
    )
  }

  /**
   * external events
   */
  window.addEventListener(
    'cart.is-updating',
    e => {
      const cartSection = document.querySelector(cartSelector)
      const cartForm = cartSection.querySelector('form')
      cartForm.classList.toggle('loading', e.detail)
    },
    { signal: cartAbortController.signal }
  )

  window.addEventListener(
    'cart.close-drawer',
    e => {
      const url = new URL(window.location)
      url.searchParams.delete('cart')
      window.history.replaceState({}, null, url.href)
      const cartDrawer = drawerContainer.querySelector(cartSelector)
      cartDrawer.remove()
    },
    { signal: cartAbortController.signal }
  )
}
