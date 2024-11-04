# Shopify starter theme

(Somewhat) opinionated starting point for making Shopify themes with [barba.js](https://github.com/barbajs/barba).

Based on the `vite-shopify-example` from [shopify-vite](https://github.com/barrel/shopify-vite/tree/main).

With added functions (inside `/frontend/framework`) making some annoying aspects of, especially ajax-navigation-based, development a little less annoying 🥸. You can choose to use them, or some of them, however you like. They work well together, but can also be used independently, whatever's needed. If you f.ex. remove Barba from your project, you can probably also remove `useHydrate` and `useTransition`.

The theme is deployed automatically when pushing to the `main` branch, using Shopify CLI.

## Getting started

### Code

1. Add this theme to your store

Follow Shopify documentation on how. Typically zip this folder and upload it as a new theme.

2. Duplicate the theme, this theme will be used as development theme.

You should now have two themes with an ID each.

3. Install and configure Shopify's Theme Access app

Follow [the official guide](https://shopify.dev/docs/storefronts/themes/tools/theme-access). Create a new user and get a password sent by email.

4. Update Github repository secrets with Shopify CLI variables

Found at a url similar to this:  
https://github.com/your-username/name-of-this-repo/settings/secrets/actions

Create two repository secrets:  
`SHOPIFY_STORE` - Store URL, like your-store.myshopify.com  
`SHOPIFY_CLI_THEME_TOKEN` - Password generated from Theme Access app

5. Install packages

```bash
pnpm install
```

6. Add/update environments

```yaml
# shopify.theme.toml
[environments.development]
store = "your-store"
theme = "987654321123"
...

[environments.production]
store = "your-store"
theme = "123456789123"
...
```

Where `theme` is the ID's you get from step 1 and 2.

Per default the scripts in `package.json` is setup to handle one `development` and one `production` environment. Update this to your needs. But the `production` environment is required, as it's used by the Github Action.

7. Run dev server

```bash
pnpm run dev
```

Site is now running locally on `http://127.0.0.1:9292`, using content from your development theme.

### Theme settings

The theme is setup to handle a dark and a light favicon, and a browser color theme. This is edited in theme settings.

Depending on the projects need for colors, you should define and name the amount of colors in the settings_schema.json, under "Colors". The theme's predefined to handle text-, background-, primary- and secondary colors. But add/remove as needed.