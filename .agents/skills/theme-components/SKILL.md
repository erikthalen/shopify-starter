---
name: theme-components
description: How to write sections, snippets and blocks in this Shopify theme, primarily how to structure their CSS. Use whenever creating, editing or reviewing a .liquid file in sections/, snippets/ or blocks/, or any {% stylesheet %} block, even for a small style tweak.
---

# Theme components

Sections, snippets and blocks are self-contained components. Each one owns its markup, its styles and (for sections and blocks) its schema, in a single `.liquid` file.

## File anatomy

Keep this order:

A snippet renders its own root element:

```liquid
{% doc %}
  What it renders, its params and an example.
{% enddoc %}

{%- liquid
  assign ...
-%}

<div class="product-card">...</div>

{% stylesheet %}
  .product-card {
    ...
  }
{% endstylesheet %}
```

A section or block doesn't. Shopify already wraps it in an element, so the root class (and the tag, when it means something) goes in the schema:

```liquid
<hgroup>...</hgroup>

<ul>
  ...
</ul>

{% stylesheet %}
  .featured-collection {
    ...
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Featured collection",
  "tag": "section",
  "class": "featured-collection"
}
{% endschema %}
```

## Principles

1. **Semantic HTML first.** Pick the element that describes the content (`<article>`, `<nav>`, `<hgroup>`, `<details>`, `<ul>`). It makes the component accessible, and it means most children can be styled by element instead of by class. erikt/ui already styles native elements, see the `erikt-ui` skill.
2. **One root element with one root class, everything nested under it.** The component never styles anything outside its root. For sections and blocks the root is Shopify's wrapper, set through the schema.
3. **Styles live with the component.** Use the file's `{% stylesheet %}` block. Global rules (`:root`, `html`, `body`, bare elements, utilities) and templates without a section go in `src/theme.css`.

## Rules

- [CSS](rules/css.md): root class, nesting, selectors, property order, breakpoints, values, and styling nested components.
