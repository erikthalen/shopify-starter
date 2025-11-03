declare global {
  interface Window {
    Shopify: {
      designMode: boolean
      routes: Record<string, string>
    }
    forcePageRefresh: boolean
  }
}

export {}
