# Shopify starter theme

(Somewhat) opinionated starting point for making Shopify themes running Barba js.

Based on the `vite-shopify-example` from [shopify-vite](https://github.com/barrel/shopify-vite/tree/main).

With added functions (inside `/frontend/framework`) making some annoying aspects of, especially ajax-navigation-based, development a little less annoying 🥸. You can choose to use them, or some of them, however you like. They work well together, but can also be used independently, whatever's needed. If you f.ex. remove Barba from your project, you can probably also remove `useHydrate` and `useTransition`.

## Getting started

### Code

1. Add this theme to your store

Follow Shopify documentation on how. Typically zip this folder and upload it as a new theme.

2. Install packages

```bash
pnpm install
```

2. Add/update environment

```yaml
# shopify.theme.toml
[environments.development]
store = "my-store"
theme = "123456789"
ignore = ["templates/*", "config/settings_data.json", "locales/*"]

[environments.production]
store = "my-store"
theme = "987654321"
ignore = ["templates/*", "config/settings_data.json", "locales/*"]
```

Where `theme` is the id you get from step 1.

Per default the scripts in `package.json` is setup to handle one `development` and one `production` environment. Update this to your needs.

It seems Shopify syncs files with the currently deployed codebase when running `shopify theme dev`. Because the project's built files are hashed, the "live" site doesn't seem to be able to find the correct css/js, while developing. To prevent any risk, setup two themes where one is used to run `shopify theme dev` against, and the other is connected to `shopify theme push`.

1. Run dev server

```bash
pnpm run dev
```

Site is now running locally on `http://127.0.0.1:9292`

### Theme settings

The theme is setup to handle a dark and a light favicon, and a browser color theme. This is edited in theme settings.

Depending on the projects need for colors, you should define and name the amount of colors in the settings_schema.json, under "Colors". The theme's predefined to handle text-, background-, primary- and secondary colors. But add/remove as needed.