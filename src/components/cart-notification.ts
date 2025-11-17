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
  notificationContent: null as Promise<Element | null> | null,

  abortController: new AbortController(),

  /**
   * Fetches the `sections/cart-notification-content.liquid` of a given Product Variant.
   * Using the [Shopify Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering)
   */
  async getNotificationSection(variantId: string | number) {
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

  getNotificationContent(form: HTMLFormElement) {
    const data = this.parseForm(form)
    if (!data) return
    this.notificationContent = this.getNotificationSection(data.id.toString())
  },

  async updateAndShowNotification(form: HTMLFormElement) {
    const data = this.parseForm(form)
    const notificationContent = await this.notificationContent

    if (!data || !notificationContent) return

    this.$root.innerHTML = notificationContent.innerHTML || ""

    const dialog = this.$root as HTMLDialogElement

    dialog.show()
  },

  async init() {
    try {
      window.addEventListener(
        "ajax:send",
        async (e: CustomEventInit) => {
          // @ts-expect-error alpine-ajax adds a target that ts doesn't know about
          this.getNotificationContent(e.target as HTMLFormElement)
        },
        { signal: this.abortController.signal }
      )

      window.addEventListener(
        "ajax:after",
        async (e: CustomEventInit) => {
          if (!e.detail.response.ok) {
            this.notificationContent = null
            return
          }

          // @ts-expect-error alpine-ajax adds a target that ts doesn't know about
          this.updateAndShowNotification(e.target as HTMLFormElement)
        },
        { signal: this.abortController.signal }
      )
    } catch (error) {
      console.log(error)
    }
  },

  parseForm(form: HTMLFormElement) {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData?.entries())

    if (data?.form_type !== "product") return

    return data
  },

  destroy() {
    try {
      this.abortController.abort()
    } catch (error) {
      console.log(error)
    }
  },
}))
