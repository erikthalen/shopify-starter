import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  base: '/shopify-starter/',
  title: 'Shopify starter',
  description: '',
  head: [['link', { rel: 'icon', href: '/.vitepress/theme/logo.png' }]],
  themeConfig: {
    logo: '/.vitepress/theme/logo.png',
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
        text: 'Guide',
        items: [
          {
            text: 'Component',
            link: '/component',
          },
        ],
      },
      {
        text: 'Framework',
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
