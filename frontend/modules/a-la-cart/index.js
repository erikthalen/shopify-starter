import { debounce } from './utils'

function defaultParser(form) {
  const formData = new FormData(form)
  const [id] = formData.getAll('id')
  const quantity = parseInt(formData.getAll('quantity'))

  return {
    items: [{ id, quantity }],
  }
}

function setUrlParam(key, value, useBarbaNavigation) {
  if(useBarbaNavigation) {
    // can't be used together with barba
    // barba.history.add(url.href, 'popstate', 'replace')
    // barba.history.remove()
    return
  }

  const url = new URL(window.location.href)

  if (value === null) {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, value)
  }
  window.history.replaceState({}, null, url)

}

function redirect(to, useBarbaNavigation) {
  if(useBarbaNavigation) {
    return
  }

  window.location.replace(to)
}

function dispatchLoadingEvent(loadingState) {
  window.dispatchEvent(
    new CustomEvent('a-la-cart.is-updating', { detail: loadingState })
  )
}

async function fetchShopifyPage(url, { signal, cache = true } = {}) {
  const parser = new DOMParser()
  const res = await fetch(`${url}${cache ? '?cache=false' : ''}`, { signal })
  return parser.parseFromString(await res.text(), 'text/html')
}

function replaceDom(newDocument, selector) {
  const oldCart = document.body.querySelector(selector)
  const newCartContainer = newDocument.querySelector(selector)

  oldCart.after(newCartContainer)
  oldCart.remove()

  return newCartContainer
}

const debouncedUpdateCartFetch = debounce(async (body, { signal }) => {
  dispatchLoadingEvent(true)

  await fetch('/cart/update.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // signal,
    body: JSON.stringify(body),
  })

  const newCart = await fetchShopifyPage('/cart', { signal })

  dispatchLoadingEvent(false)

  return newCart
}, 200)

function updateCartOnCartChange(cartSectionSelector, cartForm) {
  const cartChangeAbortController = new AbortController()

  return new Promise(resolve => {
    cartForm.addEventListener(
      'change',
      async e => {
        if (e.target.name === 'updates[]') {
          try {
            // both update cart and get new cart markup back
            const newCartPageDocument = await debouncedUpdateCartFetch({
              updates: { [e.target.id]: parseInt(e.target.value) },
            })

            const newCartContainer = replaceDom(
              newCartPageDocument,
              cartSectionSelector
            )

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

            const newCart = await fetchShopifyPage(link.href, {
              cache: false,
            })

            const newCartContainer = replaceDom(newCart)

            dispatchLoadingEvent(false)

            cartChangeAbortController.abort()
            resolve(newCartContainer)
          },
          { signal: cartChangeAbortController.signal }
        )
      })
  })
}

async function addToCart(data) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    window.dispatchEvent(
      new CustomEvent('a-la-cart.product-added', { detail: await res.json() })
    )
  } catch (error) {
    console.log(`Couldn't add to card: `, error)
  }
}

// runs itself again, when the markup changes
async function listenAndUpdateRecursive(cartSectionSelector, cartForm) {
  const newCartForm = await updateCartOnCartChange(
    cartSectionSelector,
    cartForm
  )
  listenAndUpdateRecursive(cartSectionSelector, newCartForm)
}

async function fetchAndOpenDrawerCart(cartSectionSelector, drawerContainer) {
  const cartPage = await fetchShopifyPage('/cart')
  const cart = cartPage.querySelector(cartSectionSelector)
  drawerContainer.append(cart)

  listenAndUpdateRecursive(cartSectionSelector, cart.querySelector('form'))
}

function closeDrawer(cartSectionSelector, drawerContainer, useBarbaNavigation) {
  drawerContainer.querySelector(cartSectionSelector)?.remove()
  setUrlParam('cart', null, useBarbaNavigation)
}

let teardownController = null

export default async ({
  useBarbaNavigation = false,
  cartSectionSelector = '.main-cart',
  productFormSelector = '.shopify-product-form',
  productFormParser, // https://shopify.dev/docs/api/ajax/reference/cart
  drawerContainer = document.body,
} = {}) => {
  // remove any old loading listeners
  // if this function is run twice
  teardownController?.abort()
  teardownController = new AbortController()

  if (drawerContainer) {
    closeDrawer(cartSectionSelector, drawerContainer, useBarbaNavigation)

    const url = new URL(window.location)

    if (url.pathname === '/cart') {
      redirect('/?cart', useBarbaNavigation)
    }

    if (url.searchParams.has('cart')) {
      await fetchAndOpenDrawerCart(cartSectionSelector, drawerContainer)
      window.dispatchEvent(new CustomEvent('a-la-cart.drawer-opened'))
    }

    const cartLinks = document.querySelectorAll('a[href="/cart"]')

    cartLinks.forEach(link => {
      link?.addEventListener(
        'click',
        async e => {
          e.preventDefault()
          e.stopPropagation()
          setUrlParam('cart', '', useBarbaNavigation)
          await fetchAndOpenDrawerCart(cartSectionSelector, drawerContainer)
          window.dispatchEvent(new CustomEvent('a-la-cart.drawer-opened'))
        },
        { signal: teardownController.signal }
      )
    })

    window.addEventListener(
      'keydown',
      e => {
        if (e.key !== 'Escape') return
        closeDrawer(cartSectionSelector, drawerContainer, useBarbaNavigation)
      },
      {
        signal: teardownController.signal,
      }
    )
  }

  const cartSection = document.querySelector(cartSectionSelector)

  if (cartSection) {
    listenAndUpdateRecursive(
      cartSectionSelector,
      cartSection.querySelector('form')
    )
  }

  const productForm = document.querySelector(productFormSelector)

  if (productForm) {
    const parse =
      typeof productFormParser === 'function'
        ? productFormParser
        : defaultParser

    productForm.addEventListener(
      'change',
      () =>
        setUrlParam(
          'variant',
          parse(productForm).items[0].id,
          useBarbaNavigation
        ),
      { signal: teardownController.signal }
    )

    productForm.addEventListener(
      'submit',
      async e => {
        e.preventDefault()
        await addToCart(parse(productForm))
      },
      { signal: teardownController.signal }
    )
  }

  /**
   * external events
   */
  window.addEventListener(
    'a-la-cart.close-drawer',
    () => closeDrawer(cartSectionSelector, drawerContainer, useBarbaNavigation),
    {
      signal: teardownController.signal,
    }
  )
}
