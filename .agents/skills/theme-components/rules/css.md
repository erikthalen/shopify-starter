# CSS

## Contents

- One root element, one root class
- Sections and blocks: root through the schema
- Nest everything under the root
- No global rules
- `&` only when needed
- Style elements, not classes
- Classes for nested components
- Keep class names distinct
- No BEM
- Order inside a rule
- Property order
- Breakpoints
- Values
- Dynamic values from Liquid
- Styling a nested snippet
- Full example

---

## One root element, one root class

Every component has exactly one root element, and it carries the component's root class. Everything the component renders sits inside it, including dialogs, backdrops and the buttons that open them. Name the class after what the component is, in kebab-case. It doesn't have to match the file name. A file name can be too broad (`footer.liquid` renders `.site-footer`, not `.footer`).

**Incorrect:** three siblings, three top-level rules.

```liquid
<button class="filter-button">Filter</button>
<dialog class="collection-filter">...</dialog>
<div class="collection-filter-backdrop"></div>
```

**Correct:** one root (here the block's wrapper, see below) holds all three.

```liquid
<button class="filter-button">Filter</button>
<dialog class="filter-dialog">...</dialog>
<div class="filter-backdrop"></div>

{% schema %}
{
  "name": "Filter",
  "class": "collection-filter"
}
{% endschema %}
```

```css
.collection-filter {
  .filter-dialog { ... }
  .filter-backdrop { ... }
}
```

`@keyframes` can't be nested, so they are the one top-level exception. Prefix the name with the root class: `@keyframes product-card-skeleton-pulse`.

---

## Sections and blocks: root through the schema

Shopify wraps every section and every theme block in its own element (`<div class="shopify-section">`, `<div class="shopify-block">`). Use that wrapper as the root instead of adding a second one in the markup. Set the root class with the schema's `class`, and the element with `tag` when a semantic element fits. Sections accept `article`, `aside`, `div`, `footer`, `header` and `section`. Blocks accept any tag.

**Incorrect:** a wrapper inside Shopify's wrapper.

```liquid
<footer class="site-footer">
  <nav>...</nav>
</footer>

{% schema %}
{ "name": "Footer" }
{% endschema %}
```

**Correct:**

```liquid
<nav>...</nav>

{% schema %}
{
  "name": "Footer",
  "tag": "footer",
  "class": "site-footer"
}
{% endschema %}
```

The schema can't set an `id` or a Liquid `style`. When htmx swaps the component's content, or a custom property needs a value from settings, add one inner element for it. Styles for the root's own box (margin, padding, width, position) stay on the root. Layout for the children (grid, flex, gap) goes on the inner element, through a class.

```liquid
<div id="main_collection" class="collection-content">...</div>

{% schema %}
{
  "name": "Main collection",
  "tag": "section",
  "class": "main-collection"
}
{% endschema %}
```

When htmx swaps a [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering) response into an element on the page, select the wrapper's children (`hx-select=".predictive-search-results > *"`) so the content isn't nested one level too deep. Give the receiving element the section's root class, so the section's styles apply there.

Snippets have no schema, so a snippet always renders its own root element with the root class.

---

## Nest everything under the root

The stylesheet has one top-level rule: the root class. Every other selector is nested inside it. That's how styles stay scoped to the component.

**Incorrect:**

```css
.main-product {
  display: grid;
}

.main-product-info {
  padding: 1.25rem;
}

.main-product h1 {
  margin-bottom: 0.25rem;
}
```

**Correct:**

```css
.main-product {
  display: grid;

  .product-info {
    padding: 1.25rem;

    h1 {
      margin-bottom: 0.25rem;
    }
  }
}
```

---

## No global rules

A component's stylesheet only styles the component. Rules for `:root`, `html`, `body`, bare elements at the top level, and utility classes go in `src/theme.css`, even when only one component needs them today.

**Incorrect:** in `sections/header.liquid`.

```css
:root {
  --header-height: 2.5rem;
}

.site-header {
  height: var(--header-height);
}
```

**Correct:** the custom property is declared in `src/theme.css`, and the section only uses it.

```css
.site-header {
  height: var(--header-height);
}
```

---

## `&` only when needed

Native nesting doesn't need `&` in front of a descendant selector. Use it only when the selector attaches to the parent itself: pseudo-classes, pseudo-elements, attributes, modifier classes and compound selectors.

**Incorrect:**

```css
.main-product {
  & h1 {
    margin-bottom: 0.25rem;
  }

  & details {
    margin-top: 1rem;
  }
}
```

**Correct:**

```css
.main-product {
  h1 {
    margin-bottom: 0.25rem;
  }

  details {
    margin-top: 1rem;

    &[open] {
      padding-bottom: 1rem;
    }
  }

  a {
    &:hover {
      text-decoration: underline;
    }
  }
}
```

---

## Style elements, not classes

Write semantic HTML and target the elements directly. A `<nav>` with a `<ul>` of links doesn't need `.nav`, `.nav-list` and `.nav-link`.

**Incorrect:**

```html
<!-- sections/footer.liquid, root .site-footer set in the schema -->
<div class="links">
  <a class="link" href="...">...</a>
</div>
```

```css
.site-footer {
  .links {
    display: flex;
  }
  .link {
    color: var(--ui-neutral-500);
  }
}
```

**Correct:**

```html
<!-- sections/footer.liquid, root .site-footer set in the schema -->
<nav aria-label="Shop">
  <ul>
    <li><a href="...">...</a></li>
  </ul>
</nav>
```

```css
.site-footer {
  ul {
    display: flex;
  }

  a {
    color: var(--ui-neutral-500);
  }
}
```

Add a class when no element describes the thing well, or when two elements of the same type need different styles (`.copyright` on one of several `<p>`).

---

## Classes for nested components

An element selector reaches every matching descendant, including elements inside snippets and blocks rendered by the component. When a component renders other components, give the elements you style a class, so the rules don't leak into the children.

**Incorrect:** `img` also hits the image inside every rendered `product-card`.

```css
.featured-collection {
  img {
    aspect-ratio: 16 / 9;
  }
}
```

**Correct:**

```css
.featured-collection {
  .hero-image {
    aspect-ratio: 16 / 9;
  }
}
```

Leaf components that render no other components can style bare elements freely.

---

## Keep class names distinct

Nesting scopes a rule to the root, but not away from the components the root renders. A section's `.content` rule also matches the `.content` inside every snippet it renders. Avoid single generic words like `content`, `inner`, `actions`, `count`, `title`, `info`, `items`, `media`, `label` or `value`. Name the specific thing instead: `.item-actions`, `.result-count`, `.product-info`.

Don't solve clashes with chains of child combinators. `> article > .content > .bar` is hard to read and breaks as soon as the markup is reordered. A single `>` is fine when it really means "direct children", like `> *` in a layout.

**Incorrect:**

```css
.cart-drawer {
  > dialog > article > .content {
    display: grid;
  }
}
```

**Correct:**

```css
.cart-drawer {
  .drawer-content {
    display: grid;
  }
}
```

---

## No BEM

Class names are plain and descriptive. They are already scoped by nesting, so they don't need the root name and `__` as a prefix.

**Incorrect:**

```css
.main-product {
  .main-product__info { ... }
  .main-product__info--sticky { ... }
}
```

**Correct:**

```css
.main-product {
  .product-info {
    ...

    &.sticky { ... }
  }
}
```

---

## Order inside a rule

1. Declarations, in property order (see below)
2. Media queries
3. States on the element itself (`&:hover`, `&[open]`, `&.compact`)
4. Pseudo-elements (`&::before`)
5. Child selectors, roughly in DOM order

```css
.product-card {
  position: relative;
  display: grid;
  gap: 0.75rem;

  @media (width >= 48rem) {
    gap: 1rem;
  }

  &:hover {
    opacity: 0.9;
  }

  img {
    border-radius: 0.25rem;
  }

  a {
    &::before {
      content: "";
      position: absolute;
      inset: 0;
    }
  }
}
```

---

## Property order

Group declarations in this order. Put an empty line between groups when a rule has more than a few properties.

| Group       | Properties                                                                           |
| ----------- | ------------------------------------------------------------------------------------ |
| Stacking    | `isolation`, `z-index`                                                               |
| Position    | `position`, `inset`, `top`, `right`, `bottom`, `left`                                |
| Layout      | `display`, `grid-*`, `flex-*`, `place-*`, `align-*`, `justify-*`, `gap`, `order`     |
| Box         | `width`, `height`, `min-*`, `max-*`, `aspect-ratio`, `margin`, `padding`, `overflow` |
| Visual      | `border`, `border-radius`, `background`, `box-shadow`, `opacity`                     |
| Typography  | `color`, `font-*`, `line-height`, `text-*`, `letter-spacing`                         |
| Transform   | `transform`, `translate`, `scale`, `rotate`                                          |
| Motion      | `transition`, `animation`, `view-transition-name`                                    |
| Interaction | `cursor`, `pointer-events`, `user-select`, `scroll-*`, `touch-action`                |
| Content     | `content`                                                                            |

```css
.product-card {
  isolation: isolate;

  position: relative;
  display: grid;
  justify-items: baseline;
  gap: 0.75rem;

  transition: opacity 0.2s var(--ui-ease-out);
}
```

---

## Breakpoints

Write mobile-first with `min-width` range syntax. Use only these widths (the Tailwind scale):

| Name | Query                     |
| ---- | ------------------------- |
| sm   | `@media (width >= 40rem)` |
| md   | `@media (width >= 48rem)` |
| lg   | `@media (width >= 64rem)` |
| xl   | `@media (width >= 80rem)` |
| 2xl  | `@media (width >= 96rem)` |

Nest the media query inside the rule it changes, never as a top-level block.

**Incorrect:**

```css
.main-product {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 767px) {
  .main-product {
    grid-template-columns: 1fr;
  }
}
```

**Correct:**

```css
.main-product {
  display: grid;

  @media (width >= 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

Guard hover styles so they don't stick on touch screens:

```css
a {
  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
}
```

---

## Values

- **Spacing and sizes:** raw `rem` (`gap: 1rem`, `padding-block: 4rem 1rem`). Use `px` only for hairlines (`1px solid`).
- **Colours, radii, shadows, easing:** tokens from `src/ui/tokens.css` (`var(--ui-neutral-500)`, `var(--ui-rounded-3)`, `var(--ui-shadow-2)`, `var(--ease-glide-3)`).
- **Logical properties** when they read naturally: `padding-inline`, `margin-block`, `inset`.

---

## Dynamic values from Liquid

`{% stylesheet %}` is static and can't contain Liquid. Pass setting values as custom properties on the element, and read them in the stylesheet.

```liquid
<div class="banner-media" style="--banner-height: {{ section.settings.height }}rem">
```

```css
.banner-media {
  min-height: var(--banner-height, 30rem);
}
```

---

## Styling a nested snippet

A component should rarely reach into a snippet it renders. Decide per case:

| Need                                       | Do this                                                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Stacking**: `z-index`, `isolation`       | Fine to set from the parent.                                                                                       |
| **Restyling**: how the snippet looks       | Add a modifier class to the snippet and style it in the snippet's own stylesheet. Pass it through a `class` param. |
| **Layout**: position, size, grid placement | Wrap the snippet in an element owned by the parent, and lay out the wrapper.                                       |

**Stacking, fine:**

```css
.product-card {
  .quick-buy {
    z-index: 1;
  }
}
```

**Restyling, incorrect:** the section changes how the card looks from the outside.

```css
.cart-upsell {
  .product-card {
    gap: 0.25rem;

    img {
      border-radius: 0;
    }
  }
}
```

**Restyling, correct:** the card owns the variant.

```liquid
{% render 'product-card', product: product, class: 'compact' %}
```

```css
/* snippets/product-card.liquid */
.product-card {
  gap: 0.75rem;

  &.compact {
    gap: 0.25rem;

    img {
      border-radius: 0;
    }
  }
}
```

**Layout, incorrect:** the section sizes the snippet's root.

```css
.featured-collection {
  .product-card {
    grid-column: span 2;
    width: 20rem;
  }
}
```

**Layout, correct:** the section lays out its own wrapper.

```liquid
<ul class="product-grid">
  {% for product in collection.products %}
    <li>{% render 'product-card', product: product %}</li>
  {% endfor %}
</ul>
```

```css
.featured-collection {
  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;

    @media (width >= 64rem) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}
```

---

## Full example

A section that renders snippets, so the elements it styles get distinct classes. The root comes from the schema.

```liquid
<hgroup class="collection-heading">
  <h2>{{ section.settings.collection.title }}</h2>
  <p>{{ section.settings.collection.description | strip_html }}</p>
</hgroup>

<ul class="product-grid">
  {%- for product in section.settings.collection.products limit: 8 -%}
    <li>{% render 'product-card', product: product %}</li>
  {%- endfor -%}
</ul>

<a class="view-all" href="{{ section.settings.collection.url }}">View all</a>

{% stylesheet %}
  .featured-collection {
    display: grid;
    gap: 2rem;
    padding: 4rem 1rem;

    @media (width >= 48rem) {
      padding-inline: 2rem;
    }

    .collection-heading {
      display: grid;
      gap: 0.5rem;

      p {
        color: var(--ui-neutral-500);
      }
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;

      @media (width >= 64rem) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    .view-all {
      justify-self: center;
    }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Featured collection",
  "tag": "section",
  "class": "featured-collection",
  "settings": [
    { "type": "collection", "id": "collection", "label": "Collection" }
  ]
}
{% endschema %}
```
