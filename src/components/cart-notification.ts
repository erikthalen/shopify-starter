/**
 * Fetches the `sections/cart-notification-content.liquid` for a given variant.
 * Using the [Shopify Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering)
 */
async function getNotificationSection(variantId: string) {
  return fetch(
    `${window.Shopify.routes.root}variants/${variantId}?section_id=cart-notification-content`
  )
    .then(async response => {
      return new DOMParser()
        .parseFromString(await response.text(), "text/html")
        ?.querySelector(".shopify-section")
    })
    .catch(() => null)
}

/**
 * The form a request was sent from, if it opted in to the notification with
 * `data-cart-notification="<variant id>"`.
 */
function getNotificationForm(sourceElement: Element | null | undefined) {
  return sourceElement?.closest<HTMLFormElement>("form[data-cart-notification]")
}

/**
 * Notification for `snippets/cart-notification.liquid`.
 * When a form with `data-cart-notification="<variant id>"` adds to or updates
 * the cart, shows `[data-ref-dialog]` filled with the `cart-notification-content`
 * section for that variant.
 */
export class CartNotification extends HTMLElement {
  #abortController = new AbortController()
  #notificationContent: Promise<Element | null> | null = null

  get #dialogElement() {
    return this.querySelector<HTMLDialogElement>("[data-ref-dialog]")!
  }

  connectedCallback() {
    this.#abortController = new AbortController()
    const { signal } = this.#abortController

    // Pre-fetch notification content while the cart request is in-flight
    document.addEventListener(
      "htmx:before:request",
      e => {
        const formElement = getNotificationForm(e.detail.ctx.sourceElement)
        if (!formElement) return

        const variantId = formElement.dataset.cartNotification
        if (!variantId) return

        this.#notificationContent = getNotificationSection(variantId)
      },
      { signal }
    )

    document.addEventListener(
      "htmx:after:request",
      async e => {
        const { sourceElement, response } = e.detail.ctx

        if (!getNotificationForm(sourceElement)) return
        if (!response || response.status >= 400) return

        await this.#show()
      },
      { signal }
    )
  }

  disconnectedCallback() {
    this.#abortController.abort()
  }

  /**
   * Shows the notification for a variant. For cart changes that don't go
   * through an htmx form, like `Shopify.actions.updateCart` called by an app.
   */
  async showVariant(variantId: string) {
    this.#notificationContent = getNotificationSection(variantId)
    await this.#show()
  }

  async #show() {
    const contentElement = await this.#notificationContent
    this.#notificationContent = null

    if (!contentElement) return

    this.#dialogElement.replaceChildren(contentElement)
    this.#dialogElement.show()
  }
}

if (!customElements.get("cart-notification")) {
  customElements.define("cart-notification", CartNotification)
}

declare global {
  interface HTMLElementTagNameMap {
    "cart-notification": CartNotification
  }
}
