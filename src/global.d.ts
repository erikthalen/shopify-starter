/**
 * Shopify's standard storefront actions, available after DOMContentLoaded.
 * https://shopify.dev/docs/api/storefront-events-and-actions/actions/call
 */
type ShopifyCartResult = {
  cart: Record<string, unknown>
  userErrors?: { message: string; code?: string; field?: string[] }[]
  warnings?: { message: string; code?: string }[]
  detail?: Record<string, unknown>
}

type ShopifyUpdateCartPayload = {
  lines?: { merchandiseId?: string; quantity?: number }[]
  [key: string]: unknown
}

type ShopifyUpdateCartEventTargetMeta = {
  type:
    | "shopify:cart:lines-update"
    | "shopify:cart:note-update"
    | "shopify:cart:attributes-update"
    | "shopify:cart:discount-update"
    | "shopify:cart:error"
  action?: "add" | "remove" | "update"
}

/**
 * An action whose default behaviour can be replaced. Only the first `configure`
 * call takes effect, later calls return `false`.
 * https://shopify.dev/docs/api/storefront-events-and-actions/actions/configure
 */
type ShopifyConfigurableAction<Args extends unknown[], Result, Meta = never> = {
  (...args: Args): Promise<Result>
  configure(options: {
    eventTarget?: [Meta] extends [never]
      ? never
      : (meta: Meta) => EventTarget | null
    handler?: (
      defaultHandler: () => Promise<Result>,
      ...args: Args
    ) => Promise<Result>
  }): boolean
}

declare global {
  interface Window {
    Shopify: {
      designMode: boolean
      routes: Record<string, string>
      actions: {
        getCart: () => Promise<ShopifyCartResult>
        updateCart: ShopifyConfigurableAction<
          [
            payload: ShopifyUpdateCartPayload,
            options?: Record<string, unknown>,
          ],
          ShopifyCartResult,
          ShopifyUpdateCartEventTargetMeta
        >
        openCart: ShopifyConfigurableAction<[], void>
      }
    }
  }
}

export {}
