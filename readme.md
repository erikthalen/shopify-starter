# Shopify starter theme

(Somewhat) opinionated starting point for making Shopify themes running Barba js.

Based on the `vite-shopify-example` from [shopify-vite](https://github.com/barrel/shopify-vite/tree/main).

With added functions (inside `/frontend/framework`) making some annoying aspects of, especially ajax-navigation-based, development a little less annoying 🥸. You can choose to use them, or some of them, however you like. They work well together, but can also be used independently, whatever's needed. If you f.ex. remove Barba from your project, you can probably also remove `useHydrate` and `useTransition`.

## Getting started

1. Add this theme to your store

Follow Shopify documentation on how. Typically zip this folder and upload it as a new theme.

2. Install packages

```bash
yarn
```

2. Add/update environment

```yaml
# shopify.theme.toml
[environments.development]
store = "my-store"
theme = "123456789"
ignore = ["templates/*", "config/*", "locales/*"]

[environments.production]
store = "my-store"
theme = "123456789"
ignore = ["templates/*", "config/*", "locales/*"]
```

Where `theme` is the id you get from step 1.

Per default the scripts in `package.json` is setup to handle one `development` and one `production` environment. Update this to your needs.

3. Run dev server

```bash
yarn dev
```

Site is now running locally on `http://127.0.0.1:9292`
