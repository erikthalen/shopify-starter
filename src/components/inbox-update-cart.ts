import htmx from "htmx.org"

/**
 * The element the Shopify Inbox chat injects. It's added by script, so it may
 * not be in the DOM yet by DOMContentLoaded.
 */
const INBOX_SELECTOR = "shopify-chat"

/**
 * Resolves with the first element matching `selector`, now or once it's added.
 * Inbox has no documented init event to listen for, so this watches the DOM.
 */
function waitForElement(selector: string) {
  return new Promise<Element>(resolve => {
    const element = document.querySelector(selector)
    if (element) return resolve(element)

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (!element) return

      observer.disconnect()
      resolve(element)
    })

    observer.observe(document.body, { childList: true, subtree: true })
  })
}

/**
 * Lets the Shopify Inbox chat add products to the cart without a page reload.
 * Replaces the default `Shopify.actions.updateCart` behaviour: shows the cart
 * notification for an added product and refreshes the cart drawer and section.
 * Only configured once the Inbox chat is on the page.
 * https://shopify.dev/docs/api/storefront-events-and-actions/actions/configure
 */
export async function configureInboxUpdateCart() {
  await waitForElement(INBOX_SELECTOR)

  window.Shopify.actions.updateCart.configure({
    handler: async (defaultUpdateCart, payload) => {
      let result

      try {
        result = await defaultUpdateCart()
      } catch (error) {
        console.error("Cart mutation failed:", error)
        throw error
      }

      // a line added by variant, e.g. gid://shopify/ProductVariant/123
      const addedVariantId = payload.lines
        ?.find(line => line.merchandiseId)
        ?.merchandiseId?.split("/")
        .pop()

      // not awaited, so it opens while the drawer refreshes
      if (addedVariantId && !result.userErrors?.length) {
        document.querySelector("cart-notification")?.showVariant(addedVariantId)
      }

      try {
        if (typeof htmx?.ajax !== "function") {
          throw new Error("htmx.ajax is not available on window")
        }

        await htmx.ajax("GET", window.location.href, {
          swap: "none",
          selectOOB:
            "#cart_drawer:outerMorph transition:true," +
            "#cart_section:outerHTML transition:true",
        })
      } catch (error) {
        console.error("Cart updated, but drawer refresh failed:", error)
      }

      return result
    },
  })
}

window.addEventListener("DOMContentLoaded", configureInboxUpdateCart)
