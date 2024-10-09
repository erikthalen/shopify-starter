import barba from '@barba/core'
import { Component } from '~/framework/types'

function isLoading(initiator, isLoading) {
  if (isLoading) {
    console.log(`%cStarted loading ${initiator}`, 'color: pink')
  } else {
    console.log(`%cFinished loading ${initiator}`, 'color: pink')
  }
}

function setUrlParam(key, value) {
  const url = new URL(window.location.href)

  if (value === null) {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, value)
  }

  barba.history.add(url.href, 'popstate', 'replace')
}

function defaultParser(form) {
  const formData = new FormData(form)
  const [id] = formData.getAll('id')
  const quantity = parseInt(formData.getAll('quantity').toString() || '1')

  return {
    items: [{ id, quantity }],
  }
}

function pdpParser(form, productData) {
  const formData = new FormData(form)
  const formValues = Object.fromEntries(formData.entries())

  const variant =
    formValues.id ||
    productData.variants.find(variant => {
      return variant.options.every((value, idx) => {
        const optionName = productData.options[idx].name
        return formValues[optionName] === value
      })
    })?.id

  const quantity = parseInt(formData.getAll('quantity').toString() || '1')

  return {
    items: [{ id: variant, quantity }],
  }
}

async function addToCart(data) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    return await res.json()
  } catch (error) {
    console.log(`Couldn't add to card: `, error)
  }
}

function disableBuyButtonIfOutOfStock(parser, form, productData) {
  const id = parser(form, productData).items[0].id
  const { available } = productData.variants.find(
    variant => variant.id === parseInt(id.toString())
  )

  const submitButton = form.querySelector('[type="submit"]')
  submitButton.disabled = !available
}

export const productForm: Component = ref => {
  if (!ref.productForm) return

  ref.productForm.forEach(async form => {
    let productData = null

    if (form.dataset.pdp) {
      const res = await fetch(window.location.pathname + '.js')
      productData = await res.json()
    }

    const parser = form.dataset.pdp !== undefined ? pdpParser : defaultParser

    // update url when interactive with the form
    form.addEventListener('change', () => {
      const id = parser(form, productData).items[0].id

      setUrlParam('variant', id)

      if (productData) {
        disableBuyButtonIfOutOfStock(parser, form, productData)
      }
    })

    form.addEventListener('submit', async e => {
      e.preventDefault()

      isLoading('product-form', true)

      const result = await addToCart(parser(form, productData))

      if (result.message) {
        console.log(result.message)
      } else {
        window.dispatchEvent(
          new CustomEvent('ss-event.cart.product-added', { detail: result })
        )
      }

      isLoading('product-form', false)
    })
  })
}
