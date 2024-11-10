type Refs = Record<string, HTMLElement[]>

export type CleanupFunction = (() => unknown) | (() => unknown)[]

export type Component = (
  ref: Refs,
  opts?: {
    // used to remove event listeners on page shift
    signal?: AbortSignal
  }
) => CleanupFunction | Promise<CleanupFunction> | void

declare global {
  interface Window {
    Shopify: {
      designMode: unknown
    }
    forceNavigationRefresh: boolean
    navigation: any
  }
}