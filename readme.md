![shopify-starter](https://socialify.git.ci/erikthalen/shopify-starter/image?description=1&forks=1&issues=1&language=1&logo=https%3A%2F%2Fexternal-content.duckduckgo.com%2Fiu%2F%3Fu%3Dhttps%253A%252F%252Flogos-download.com%252Fwp-content%252Fuploads%252F2016%252F10%252FShopify_logo_icon.png%26f%3D1%26nofb%3D1%26ipt%3D548d47c731ae681dd2fdcb33298eaa0c5ce4886065eba696034a6e26492041f9%26ipo%3Dimages&name=1&pattern=Solid&pulls=1&stargazers=1&theme=Light)

## Getting started

This demonstrates how to start developing a new theme.

### Prerequisite

Before starting, you need a Shopify store and [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)

### Initialize theme

In your terminal run:

```sh [terminal]
shopify theme init my-new-theme --clone-url https://github.com/erikthalen/shopify-starter
```

This will download the repo into a folder named `my-new-theme` inside the current directory.

### Create 2 new themes in your store

One will be used for development, and one for production.

```sh [terminal]
cd my-new-theme
shopify theme push -u -s your-store.myshopify.com
```

Enter a suiting name for the theme, when prompted.

Repeat the same command.

Name this theme the same, suffixed with `/develop` or similar.

### Update local Shopify environments

Get the ID's of the newly created themes by running:

```sh [terminal]
shopify theme list
```

Copy and paste the ID's to its corresponding environment:

```toml [shopify.theme.toml]
[environments.development]
store = "your-store"
theme = "123456789012"
# ...

[environments.production]
store = "your-store"
theme = "987654321098"
# ...
```

The repo is setup to handle one `development` and one `production` environment. Update this to your needs. If the theme will be deployed to multiple stores, the Github Action needs to be updated to run `shopify theme deploy` to all the targets/environments.

## Development

Based on the `vite-shopify-example` from [shopify-vite](https://github.com/barrel/shopify-vite/tree/main). Check documentation for development configuration.

### Install packages

```sh
pnpm install
```

### Run dev server

```sh
pnpm run dev
```

Site will be opened automatically on url `http://127.0.0.1:9292`, using content from your development theme.

## Deployment

The repo is using Github Action to deploy the theme when changes are pushed to the `main` branch. To get this to work some settings needs to be made.

### Install and configure Shopify's Theme Access app

Follow [the official guide](https://shopify.dev/docs/storefronts/themes/tools/theme-access).

Create a new user and receive a password by email.

### Update Github repository secrets with Shopify CLI variables

Found at a url similar to this:  
https://github.com/your-username/name-of-this-repo/settings/secrets/actions

Create two repository secrets:
| Name | Description |
| ------------- | ------------- |
| `SHOPIFY_STORE` | Store URL, like your-store.myshopify.com |
| `SHOPIFY_CLI_THEME_TOKEN` | Password generated from Theme Access app |

### Manual deployment

The repo also supports manual deployments from the CLI by running:

```sh
pnpm run deploy
```

## Theme settings

There's a few Shopify Theme Settings included as schema fields. Feel free to remove the fields from `config/settings_schema.json`, if they aren't relevant to your project.

### Favicons

The theme is setup with a dark and a light favicon.

### Browser theme color

A color string defining the color of the browser UI, mainly on mobile browsers.

### Color schemes

Depending on the projects need for colors, you should define and name the amount of colors in the settings_schema.json, under "Colors".

The theme's predefined to handle text-, background-, primary- and secondary colors. But add/remove as needed.

### Custom `<head>`

Used for adding tracking and GDPR code. Renders in the top of the `<head>`
