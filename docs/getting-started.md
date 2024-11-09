# Getting started

### Prerequisite

Before starting, you need a Shopify store and Shopify CLI

### Initialize theme

In your terminal run:

```sh
shopify theme init my-new-theme --clone-url https://github.com/erikthalen/shopify-starter
```

This will download the repo info a folder named `my-new-theme` inside the current directory.

### Create new themes in your store

```sh
cd my-new-theme
shopify theme push -u -s your-store.myshopify.com
```

Enter a suiting name for the theme, when prompted.

The repo needs 2 themes to work. One that will be used as production, and one that is used while developing.

Repeat the same command:

```sh
shopify theme push -u -s your-store.myshopify.com
```

Name this theme the same, suffixed with `/develop` or similar.

### Update local Shopify environments

Get the ID's of the newly created themes by running:

```sh
shopify theme list
```

Copy and paste the ID's to its corresponding environment:

```yaml [./shopify.theme.toml]
[environments.development]
store = "your-store" // [!code focus]
theme = "123456789012" // [!code focus]
ignore = [
  "templates/*.json",
  "templates/**/*.json",
  "sections/*.json",
  "config/settings_data.json",
  "locales/*",
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

The repo is setup to handle one `development` and one `production` environment. Update this to your needs. If the theme will be deployed to multiple stores, the Github Action needs to be updated to run `shopify theme deploy` to all the targets/environments.
