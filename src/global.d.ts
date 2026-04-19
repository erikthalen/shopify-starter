declare global {
  interface Window {
    Alpine: typeof import("./alpine").default
    Swup: typeof import("./swup").default
    Shopify: {
      designMode: boolean
      routes: Record<string, string>
    }
  }
}

export {}
