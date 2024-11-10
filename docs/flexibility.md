# Flexibility

This repo's aim is to not lock you into a certain way of working. But only help out with some common hurdles, and make it as easy as possible to get going.

Therefore, most of the code that's included in the repo when installing it for the time can be removed. If it doesn't fit your needs.

### CSS

The only thing installed by default is postcss, as vite comes installed with this out of the box.

It's up to you to decide how to work with styling in your project.

[Shopify vite](https://shopify-vite.barrelny.com/) is used to power the project. The only change made to its default settings is that the entrypoint is set to `/frontend/theme.css`.

If you're installing [Tailwind](https://tailwindcss.com/docs/installation/using-postcss), the css file would look like this:

```css
/* frontend/theme.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

and the `frontend/css/` folder can be removed.