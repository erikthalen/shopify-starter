# Getting started

This demonstrates how to start developing a new theme.

### Prerequisite

Before starting, you need a Shopify store and [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)

### Initialize theme

In your terminal run:

::: code-group
```sh [terminal]
shopify theme init my-new-theme --clone-url https://github.com/erikthalen/shopify-starter
```
:::

This will download the repo into a folder named `my-new-theme` inside the current directory.

### Create 2 new themes in your store

One will be used for development, and one for production.

::: code-group
```sh [terminal]
cd my-new-theme
shopify theme push -u -s your-store.myshopify.com
```
:::

Enter a suiting name for the theme, when prompted.

Repeat the same command.

Name this theme the same, suffixed with `/develop` or similar.

### Update local Shopify environments

Get the ID's of the newly created themes by running:

::: code-group
```sh [terminal]
shopify theme list
```
:::

Copy and paste the ID's to its corresponding environment:

::: code-group
```toml [shopify.theme.toml]
[environments.development]
store = "your-store" // [!code focus]
theme = "123456789012" // [!code focus]
ignore = [
  "templates/*.json",
  "templates/**/*.json",
  "sections/*.json",
  "config/settings_data.json",
  "locales/*"
]

[environments.production]
store = "your-store" // [!code focus]
theme = "987654321098" // [!code focus]
ignore = [
  "templates/*.json",
  "templates/**/*.json",
  "sections/*.json",
  "config/settings_data.json",
  "locales/*",
]
allow-live = true
```
:::

The repo is setup to handle one `development` and one `production` environment. Update this to your needs. If the theme will be deployed to multiple stores, the Github Action needs to be updated to run `shopify theme deploy` to all the targets/environments.
