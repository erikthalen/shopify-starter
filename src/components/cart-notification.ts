import { defineComponent } from "~/utils/define"

/**
 * cart-notification
 *
 * Listens for alpine-ajax updates to {% form 'product' %} and
 * shows /sections/cart-notification-content.liquid with added
 * product as content.
 *
 * The response of a {% form 'product' %} only returns /cart and
 * can't know about what product was added to the cart, that's why this is needed.
 */
export default defineComponent(() => ({
  abortController: new AbortController(),

  async getSection(variantId: string | number) {
    const response = await fetch(
      `${window.Shopify.routes.root}variants/${variantId}?section_id=cart-notification-content`
    )
    const text = await response.text()
    const markup = new DOMParser()
      .parseFromString(text, "text/html")
      ?.querySelector(".shopify-section")

    return markup
  },

  async init() {
    window.addEventListener(
      "ajax:after",
      async (e: CustomEventInit) => {
        // @ts-expect-error alpine-ajax adds a target, ts doesn't know
        const formData = new FormData(e.target as HTMLFormElement)
        const data = Object.fromEntries(formData?.entries())

        if (data?.form_type !== "product") return

        const content = await this.getSection(data.id.toString())

        if (!content) return

        this.$root.innerHTML = content.innerHTML || ""

        const dialog = this.$root as HTMLDialogElement

        dialog.show()
      },
      { signal: this.abortController.signal }
    )
  },

  destroy() {
    this.abortController.abort()
  },
}))
