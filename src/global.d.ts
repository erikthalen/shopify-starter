declare global {
  interface Window {
    Shopify: {
      designMode: boolean
      routes: Record<string, string>
    }
  }
}

export {}
