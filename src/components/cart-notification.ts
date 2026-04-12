import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  notificationContent: null as Promise<Element | null> | null,

  abortController: new AbortController(),

  /**
   * Fetches the `sections/cart-notification-content.liquid` for a given variant.
   * Using the [Shopify Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering)
   */
  async getNotificationSection(variantId: string) {
    return fetch(
      `${window.Shopify.routes.root}variants/${variantId}?section_id=cart-notification-content`
    )
      .then(async response => {
        return new DOMParser()
          .parseFromString(await response.text(), "text/html")
          ?.querySelector(".shopify-section")
      })
      .catch(() => null)
  },

  async init() {
    const signal = this.abortController.signal

    // Pre-fetch notification content while the cart request is in-flight
    document.addEventListener(
      "htmx:before-request",
      (e: CustomEventInit) => {
        const { elt, requestConfig } = e.detail

        if (!requestConfig?.path?.includes("/cart/add")) return

        const variantId = new FormData(elt).get("id")?.toString()
        if (!variantId) return

        this.notificationContent = this.getNotificationSection(variantId)
      },
      { signal }
    )

    document.addEventListener(
      "htmx:after-request",
      async (e: CustomEventInit) => {
        const { requestConfig, failed } = e.detail

        if (failed || !requestConfig?.path?.includes("/cart/add")) return

        const content = await this.notificationContent
        this.notificationContent = null

        if (!content) return

        this.$root.innerHTML = content.innerHTML
        ;(this.$root as HTMLDialogElement).show()
      },
      { signal }
    )
  },

  destroy() {
    this.abortController.abort()
  },
}))
