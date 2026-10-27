---
name: alpinejs-liquid
description: Rules for writing Alpine.js inside Shopify Liquid templates in this theme. Use whenever adding or editing x-data, x-*, :attr or @event attributes in snippets/, sections/, blocks/ or layout/ .liquid files.
---

# Alpine.js in Liquid

## Rule: all markup is rendered server-side with Liquid

Every piece of HTML must be rendered by Liquid on the server. Alpine never creates markup.

- **No `x-for`.** Render lists with Liquid `{% for %}`.
- **No `x-if`, `x-html` or client-side templating.** Render every element with Liquid up front.
- **Dynamic client-side updates change state on markup that already exists** — never the markup itself.

## Guideline: how to express client-side state

Pick whatever fits the context best. As a starting point, toggling a CSS class is usually the cleanest:

- `hidden` to hide an element
- `active` to mark the active state
- other plain state classes (`open`, `selected`, `disabled`…) as needed

But let the surrounding code decide. A Tailwind utility, an inline style or CSS variable (`:style`), a native attribute (`:open`, `:disabled`, `:aria-expanded`, `:aria-busy`) or `x-show` may be the better fit — follow what nearby code already does.

```liquid
{%- # ❌ Alpine renders the list -%}
<ul>
  <template x-for="guide in filtered" :key="guide.url">
    <li x-text="guide.title"></li>
  </template>
</ul>

{%- # ✅ Liquid renders the list, Alpine only toggles state -%}
<ul>
  {% for guide in guides %}
    <li
      data-year="{{ guide.year | escape }}"
      :class="{ hidden: !matches($el) }"
    >
      {{ guide.title }}
    </li>
  {% endfor %}
</ul>
```

```liquid
<button
  class="tab"
  :class="{ active: tab === '{{ block.id }}' }"
  @click="tab = '{{ block.id }}'"
>
  {{ block.settings.title }}
</button>
```
