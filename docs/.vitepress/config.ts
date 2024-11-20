import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  cleanUrls: true,
  base: '/shopify-starter/',
  title: 'Shopify starter',
  description: '',
  head: [['link', { rel: 'icon', href: 'logo.png' }]],
  themeConfig: {
    logo: 'logo.png',
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/erikthalen/shopify-starter' },
    ],
    nav: [{ text: 'Guide', link: '/getting-started' }],
    sidebar: [
      {
        text: 'Getting Started',
        link: '/getting-started',
      },
      {
        text: 'Development',
        link: '/development',
      },
      {
        text: 'Deployment',
        link: '/deployment',
      },
      {
        text: 'Documentation',
        link: '/documentation',
      },
      {
        text: 'Guide',
        items: [
          {
            text: 'Flexibility',
            link: '/flexibility',
          },
          {
            text: 'Component',
            link: '/component',
          },
          {
            text: 'Locales',
            link: '/locales',
          },
          {
            text: 'Theme settings',
            link: '/theme-settings',
          },
        ],
      },
      {
        text: 'Liquid',
        items: [
          {
            text: '_shopify-preview.liquid',
            link: '/shopify-preview',
          },
          {
            text: 'color-scheme.liquid',
            link: '/color-scheme',
          },
          {
            text: 'image.liquid',
            link: '/image',
          },
        ],
      },
      {
        text: 'API',
        items: [
          {
            text: 'useRefs',
            link: '/framework/use-refs',
          },
          {
            text: 'useHydrate',
            link: '/framework/use-hydrate',
          },
          {
            text: 'useTransition',
            link: '/framework/use-transition',
          },
        ],
      },
    ],
  },
})
