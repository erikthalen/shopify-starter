import { Component } from "~/framework/types"

async function fetchCartAmount() {
  try {
    const res = await fetch('/cart.js')
    const json = await res.json()
    if (json?.item_count !== undefined) return json.item_count

    throw 'did not receive amount from shopify :('
  } catch (error) {
    console.log(error)
  }
}

export const cartAmount: Component = (ref) => {
  async function logAmount(e) {
    const amountFromEvent = e.detail?.items?.reduce(
      (acc, cur) => (acc += cur.quantity),
      0
    )
    const amount = amountFromEvent || (await fetchCartAmount())

    ref.cartAmount.forEach(element => {
      element.textContent = amount
    })
  }

  window.addEventListener('ss-event.cart.updated', logAmount)
  window.addEventListener('ss-event.cart.product-added', logAmount)
}