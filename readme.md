# Shopify starter theme

(Somewhat) opinionated starting point for making Shopify themes with [barba.js](https://github.com/barbajs/barba).

Based on the `vite-shopify-example` from [shopify-vite](https://github.com/barrel/shopify-vite/tree/main).

With added functions (inside `/frontend/framework`) making some annoying aspects of, especially ajax-navigation-based, development a little less annoying 🥸. You can choose to use them, or some of them, however you like. They work well together, but can also be used independently, whatever's needed. If you f.ex. remove Barba from your project, you can probably also remove `useHydrate` and `useTransition`.

The theme is deployed automatically when pushing to the `main` branch, using Shopify CLI.

## Getting started

1. Download this repo as a .zip.
2. Upload the .zip as a new theme to your store.
3. Duplicate this new theme so there's 2 identical themes, this 2'nd theme will be used during development.

The development theme can also be created by uploading the .zip to another store. The only requirement is that there's one theme that will be deployed to, and another one that is used during development.

4. Add/update environments:

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

Where `theme` are the ID's you get from step 2 and 3.

The repo is setup to handle one `development` and one `production` environment. Update this to your needs. If the theme will be deployed to multiple stores, the Github Action needs to be updated to run `shopify theme deploy` to all the targets/environments.

## Development

1. Install packages

```bash
pnpm install
```

2. Run dev server

```bash
pnpm run dev
```

Site is now running locally on `http://127.0.0.1:9292`, using content from your development theme.

## Deployment

The repo is using Github Action to deploy the theme when changes are pushed to the `main` branch. To get this to work some settings needs to be made.

1. Install and configure Shopify's Theme Access app

Follow [the official guide](https://shopify.dev/docs/storefronts/themes/tools/theme-access). Create a new user and receive a password by email.

2. Update Github repository secrets with Shopify CLI variables

Found at a url similar to this:  
https://github.com/your-username/name-of-this-repo/settings/secrets/actions

Create two repository secrets:  
`SHOPIFY_STORE` - Store URL, like your-store.myshopify.com  
`SHOPIFY_CLI_THEME_TOKEN` - Password generated from Theme Access app

## Theme settings

The theme is setup with a dark and a light favicon, and a browser color theme. This is edited in theme settings.

Depending on the projects need for colors, you should define and name the amount of colors in the settings_schema.json, under "Colors". The theme's predefined to handle text-, background-, primary- and secondary colors. But add/remove as needed.
