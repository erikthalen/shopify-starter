![Shopify Starter](https://socialify.git.ci/erikthalen/shopify-starter/image?description=1&forks=1&issues=1&language=1&logo=https%3A%2F%2Fexternal-content.duckduckgo.com%2Fiu%2F%3Fu%3Dhttps%253A%252F%252Flogos-download.com%252Fwp-content%252Fuploads%252F2016%252F10%252FShopify_logo_icon.png%26f%3D1%26nofb%3D1%26ipt%3D548d47c731ae681dd2fdcb33298eaa0c5ce4886065eba696034a6e26492041f9%26ipo%3Dimages&name=1&pattern=Solid&pulls=1&stargazers=1&theme=Light)

## Getting Started

This guide will walk you through the steps of starting to develop a new Shopify theme. It assumes you have a basic understanding of Shopify, GitHub, and terminal commands.

---

### Prerequisites

Before you begin, ensure you have the following:

1. **A Shopify Store**: Create a Shopify store if you don’t have one already.
2. **Shopify CLI**: Install the Shopify CLI by following the official [Shopify CLI documentation](https://shopify.dev/docs/api/shopify-cli).

---

### Step 1: Initialize Your Theme

To start, you'll initialize your theme by cloning the `shopify-starter` repository from GitHub. This will download the theme template and set up the necessary files.

Run the following command in your terminal:

```bash
shopify theme init my-new-theme --clone-url https://github.com/erikthalen/shopify-starter
```

This will create a folder named `my-new-theme` with all the starter files inside it.

---

### Step 2: Create Themes in Your Shopify Store

You’ll need two themes in your store:

- **Development Theme**: For testing and development.
- **Production Theme**: For live use.

#### Create the Themes

1. Navigate to the `my-new-theme` directory:

   ```bash
   cd my-new-theme
   ```

2. Push the theme to your Shopify store:

   ```bash
   shopify theme push -u your-store.myshopify.com
   ```

   - When prompted, enter a name for the theme (e.g., `my-new-theme`).
   - This will create the theme on your Shopify store.

3. Repeat the same process but with a different theme name (e.g., `my-new-theme/develop`) for your development theme:

   ```bash
   shopify theme push -u your-store.myshopify.com
   ```

---

### Step 3: Update Shopify Environments

After creating the themes, you need to update the theme IDs in your local environment.

#### Get Theme IDs

Run the following command to list all your themes and get their IDs:

```bash
shopify theme list
```

This will display a list of themes, and you need to copy the IDs of your development and production themes.

#### Update `shopify.theme.toml`

Next, open the `shopify.theme.toml` file in your project directory and update the theme IDs under the corresponding environments:

```toml
[environments.development]
store = "your-store"
theme = "development-theme-id"

[environments.production]
store = "your-store"
theme = "production-theme-id"
```

Make sure to replace the placeholders (`development-theme-id` and `production-theme-id`) with the actual theme IDs you copied.

---

### Development Setup

Now that your environment is set up, let's get started with development!

#### Step 1: Install Dependencies

Before running the theme locally, you'll need to install the necessary dependencies.

Run:

```bash
pnpm install
```

#### Step 2: Run the Development Server

Start the local development server with the following command:

```bash
pnpm run dev
```

This will launch the site in your browser at `http://127.0.0.1:9292` using the content from your development theme.

---

### Deployment Setup

To deploy your theme, we use GitHub Actions for automation. This will allow the theme to automatically deploy whenever changes are pushed to the `main` branch.

#### Step 1: Install Shopify's Theme Access App

Follow the official [Shopify Theme Access guide](https://shopify.dev/docs/storefronts/themes/tools/theme-access) to install and configure the Theme Access app.

Once done, create a new user, and you’ll receive a password for accessing the theme via the Shopify CLI.

#### Step 2: Set Up GitHub Secrets

For deployment to work via GitHub Actions, you need to add two secrets to your GitHub repository.

1. Go to your repository's [Secrets settings](https://github.com/your-username/name-of-this-repo/settings/secrets/actions).
2. Add the following secrets:

| Name                      | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `SHOPIFY_STORE`           | Your Shopify store URL (e.g., `your-store.myshopify.com`) |
| `SHOPIFY_CLI_THEME_TOKEN` | The password generated from the Theme Access app          |

---

### Manual Deployment

If you want to manually deploy your theme (outside of GitHub Actions), you can use the following command:

```bash
pnpm run deploy
```

This will push the theme to your Shopify store as configured in your `shopify.theme.toml`.

---

### Customizing Your Theme Settings

The theme includes a few predefined settings that can be adjusted based on your needs. If some settings aren’t relevant to your project, feel free to remove them.

#### Favicons

The theme supports both dark and light favicons. You can customize or remove them as necessary.

#### Browser Theme Color

This setting defines the color of the browser UI on mobile devices. You can update this color in the settings.

Example in `settings_data.json`:

```json
{
  "current": {
    "browser_theme_color": "#ff3b3b"
  }
}
```

#### Color Schemes

Define your theme’s color scheme under the `Colors` section in `settings_data.json`. The theme is set up with four default color options: `text`, `background`, `primary`, and `secondary`. You can add or remove colors as needed.

Example:

```json
{
  "current": {
    "color_schemes": {
      "scheme-1": {
        "settings": {
          "background": "#FFFFFF",
          "text": "#121212",
          "primary": "#ff3b3b",
          "secondary": "#3b84ff"
        }
      }
    }
  }
}
```

#### Custom `<head>` Content

If you need to add custom code to the `<head>` tag (such as tracking scripts or GDPR consent scripts), you can use the `custom_head` setting.

Example:

```json
{
  "current": {
    "custom_head": "<script>console.log('Custom code')</script>"
  }
}
```

This code will be rendered at the top of your theme’s `<head>`.

---

With these steps, you should have a fully functional Shopify theme set up for development and deployment. Modify the settings, styles, and configurations as needed to match your project’s requirements.
