declare global {
  interface Window {
    navigation: any
    Shopify: {
      designMode: boolean
      routes: Record<string, string>
    }
    forcePageRefresh: boolean
  }
}

export {}
