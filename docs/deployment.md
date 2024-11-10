# Deployment

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

