---
name: erikt-ui
description: Teaches agents how to use the erikt/ui CSS component library. Use this whenever writing, reviewing, or fixing HTML/CSS in a project that depends on @erikt/ui. Signals include a <link>/@import referencing erikt/ui or esm.sh/@erikt/ui, an @erikt/ui entry in package.json, or --ui-* CSS custom properties. Also use whenever asked to add or style any UI component, even if erikt/ui isn't named explicitly.
---

# erikt/ui

One CSS file that styles native HTML elements. A `<button>` is already a styled button. A `<dialog>` is already a styled modal. You write semantic HTML, add a class name for a few components, and the stylesheet does the rest.

```html
<link rel="stylesheet" href="https://esm.sh/@erikt/ui" />
```

Full docs live at https://ui.erikt.me. Every component has a page at `https://ui.erikt.me/components/<name>`. The full list is at https://ui.erikt.me/llms.txt.

## Principles

1. **Pick the right element first.** Most components are a native element. Card is `<article>`, accordion is `<details>`, separator is `<hr>`, progress is `<progress>`.
2. **Compose, don't reinvent.** A settings page is tabs, cards and fields. A row menu is a ghost button plus a popover with a `<menu>`.
3. **Use built-in variants before custom styles.** `class="outlined"`, `class="ghost destructive"`, `class="badge constructive"`.
4. **Write CSS for layout only.** Use `flex` and `grid` to arrange things. A few flow helpers (`.flex`, `.flex-col`, `.grid`, `.gap-1` to `.gap-8`) cover the common cases. Leave colors, borders, padding and type to the library.
5. **Use the platform, not JavaScript.** Popover API for menus and toasts, `<dialog>` for modals, `<details>` for disclosure, radio inputs plus `:has()` for tabs.
6. **Fit the project.** Write any extra code the way the project already does. JSX in React, Tailwind classes for layout in a Tailwind project. See [rules/frameworks.md](./rules/frameworks.md).

## Critical rules

Each rule links to a file with incorrect and correct code.

### Styling → [rules/styling.md](./rules/styling.md)

- **No hardcoded colors.** Use `var(--ui-neutral-500)`, `var(--ui-primary)`, `var(--ui-destructive)` and the other tokens. Never hex values or named colors in component CSS.
- **Change things once, on `:root`.** To match a brand, set seed variables like `--ui-primary` on `:root`. Don't put inline `style` overrides on each element.
- **No `!important`.** erikt/ui lives in `@layer ui`. Any unlayered rule you write already wins.
- **Spacing uses tokens.** `gap: var(--ui-spacing-4)`, not `gap: 13px`.
- **Transitions use the ease variables.** `transition: opacity var(--ease-glide-3)` sets the duration and the curve. Don't write `200ms ease`.
- **Shadows use tokens.** `box-shadow: var(--ui-shadow-2)`, or the class `.shadow-2`. Never a hand-written `box-shadow`.
- **Radius uses the rounded scale.** `var(--ui-rounded-3)` for controls, `var(--ui-rounded-5)` for surfaces, `var(--ui-rounded-full)` for pills and circles. Never `px` values or `50%`.
- **Change roundness with `--ui-rounded-scale` on `:root`.** `0` makes every corner square. Don't override each component's radius.
- **Don't size icons.** SVGs are `1lh` square by default, so they match the text next to them. No `width`/`height` on icons inside buttons, badges or menus.
- **No `z-index` on overlays.** Dialog, popover, toast and drawer render in the browser's top layer.
- **Dark mode is automatic.** The library uses `color-scheme: light dark`. Don't write `@media (prefers-color-scheme)` color overrides for components.

### Forms → [rules/forms.md](./rules/forms.md)

- **Wrap each control in `label.field`.** `<span>` is the label, then the control, then an optional `<small>` hint.
- **Groups of checkboxes or radios use `<fieldset>` + `<legend>`**, or `div.field` with a `<span>` title.
- **Validation is CSS only.** Add `required`, `min`, `max` or `type="email"` to the input. Add `<small data-error="required|invalid|range">` messages inside the field. An input with `data-error="required"` needs a `placeholder`. The input gets a destructive outline while it's invalid.
- **Icons, units and buttons inside an input go in the same `<label>`** with `data-prefix` or `data-suffix`.
- **On/off settings use `class="switch"`.** Short option sets use a toggle group. Don't loop buttons with a manual active class.

### Composition → [rules/composition.md](./rules/composition.md)

- **Card is `<article>`.** Put a title in `<header>` and actions in `<footer>`, as direct children.
- **Callouts are `<article role="status">` or `<article role="alert">`.** Not a styled `div`.
- **Use the built-in pieces.** `.badge` for status labels, `.empty` for empty states, `.skeleton` for loading, `aria-busy` for spinners, `<hr>` for separators.
- **Button loading state is `aria-busy`** plus `disabled`. No custom spinner markup.
- **Links that look like buttons use `<a class="button">`.** Use `<button>` for actions and `<a>` for navigation.
- **Headings with a subtitle use `<hgroup>`.** Long text goes in `.prose`.

### Overlays → [rules/overlays.md](./rules/overlays.md)

- **Dropdowns, menus and popovers use `popover` + `popovertarget`.** Put the popover element right after its trigger. If the trigger is in a button group, put the popover after the `</fieldset>` instead, or the group's corners break.
- **Menus are `<menu>` with `<li><button class="ghost">`.** Separators are `<li><hr /></li>`, group labels are `<li><small>`.
- **Modals are `<dialog closedby="any">` with an `<article>` inside.** Close buttons sit in `<form method="dialog">`.
- **Side panels are `<dialog class="drawer">`.** Set the edge with `data-position`. For no backdrop, use `<div popover class="drawer">`.
- **Tooltips are `data-tooltip` + `aria-label`** on the trigger. No wrapper element.
- **Toasts are `<div popover class="toast">`** holding an alert `<article>`.

## Key patterns

```html
<!-- Field with hint and validation -->
<label class="field">
  <span>Email</span>
  <input type="email" placeholder="you@example.com" required />
  <small data-error="required">Email is required.</small>
  <small data-error="invalid">Enter a valid email address.</small>
</label>

<!-- Card with header and footer -->
<article>
  <header><strong>Team</strong></header>
  <p>Invite people to collaborate.</p>
  <footer>
    <button class="outlined">Cancel</button>
    <button>Invite</button>
  </footer>
</article>

<!-- Button variants and icon button with tooltip -->
<button>Save</button>
<button class="outlined">Cancel</button>
<button class="ghost destructive">Delete</button>
<button class="ghost square" aria-label="Settings" data-tooltip>
  <svg><!-- icon --></svg>
</button>

<!-- Dropdown menu -->
<button popovertarget="row-menu">Actions</button>
<div id="row-menu" popover>
  <menu>
    <li><button class="ghost">Edit</button></li>
    <li><hr /></li>
    <li><button class="ghost destructive">Delete</button></li>
  </menu>
</div>

<!-- Modal -->
<button onclick="document.getElementById('confirm').showModal()">Delete</button>
<dialog id="confirm" closedby="any">
  <article>
    <header><strong>Delete project?</strong></header>
    <p>This can't be undone.</p>
    <footer>
      <form method="dialog">
        <button class="destructive">Delete</button>
        <button class="outlined">Cancel</button>
      </form>
    </footer>
  </article>
</dialog>

<!-- Status colors come from variants, not raw colors -->
<span class="badge constructive">Active</span>
<span class="badge destructive">Failed</span>

<!-- Layout: flow helpers, or plain CSS -->
<div class="flex gap-2">...</div>
```

## Component selection

| Need | Use | Also good for |
| --- | --- | --- |
| Action | `<button>`. Variants: `outlined`, `secondary`, `ghost`, `link`, `destructive`. Shape: `square`, `round` | Icon-only button: `square` + `aria-label`. Full-width pill button: `round` + `width: 100%` |
| Link styled as button | `<a class="button">` |  |
| Related buttons joined | `<fieldset role="group">` (button group) | Segmented controls, split buttons |
| Text input | `<input>` inside `label.field`. Prefix and suffix with `data-prefix` / `data-suffix` | Search bars with an icon prefix and a `<kbd>` suffix |
| Long text | `<textarea>` (grows with content) |  |
| Pick one from a list | `<select>` |  |
| Pick one, searchable | `<input list>` + `<datalist>` |  |
| Number, date, color | `<input type="number">`, `type="date"`, `type="color"` |  |
| On/off setting | `<input type="checkbox" class="switch">` | Settings rows inside a card |
| Checkbox or radio list | `<fieldset>` + `<legend>` + `<label><input></label>` |  |
| Group of related fields | `<fieldset>` + `<legend>` + `label.field` items (fieldset). Fields stack. Set `flex-direction: row` on the fieldset to put them side by side | Address blocks, light and dark color pairs, password + repeat |
| 2 to 5 options as buttons | Toggle group: `<fieldset role="group">` + `<label class="toggle">` with radio inputs | View switchers (list/grid), text alignment, time ranges |
| Pressable on/off button | `<label class="toggle"><input type="checkbox" />...</label>` |  |
| Selectable tags | `<label><input type="checkbox" /><span class="badge">Tag</span></label>` |  |
| Color choice | `fieldset.color-swatch` with radios and `--swatch-color` |  |
| File upload | `label.file-drop` |  |
| One-time code | `<span class="otp"><input maxlength="6" /></span>` |  |
| Slider | `<input type="range">` |  |
| Surface | `<article>`. Variants: `secondary`, `tertiary`, `transparent` | Any boxed area: login card, pricing tier, stat tile, sidebar panel |
| Callout | `<article role="status">` or `role="alert"`. Colors: `primary`, `constructive`, `destructive`, `color1` to `color6` | Inline form errors, info banners, the body of a toast |
| Status label | `<span class="badge">` with the same color classes, plus `outlined` | Counts, "New" tags, plan names, role labels |
| Empty state | `<section class="empty">` | Any centered block of icon + heading + text + actions: login and signup cards, success screens, onboarding steps, 404 pages |
| Loading | `aria-busy` (spinner), `.skeleton` (placeholder), `.shimmer` (text that is working), `<progress>` (`.round` for a ring) |  |
| Measurement in a range | `<meter>`. `low`, `high` and `optimum` color it green, yellow or red. Change the colors with `--meter-good`, `--meter-average`, `--meter-bad` | Disk use, password strength, battery level, scores |
| Data table | `<table>`. Column sizes with `--cols`. Classes: `zebra`, `align-left`, `nowrap` |  |
| Key/value list | `<dl>` | Order summaries, profile details, metadata |
| User picture | `.avatar` on `<img>` or `<span>` | Any round icon or initials badge, like a header icon on a card |
| Event list | `<ol class="timeline">` | Activity feeds, order tracking, step-by-step guides |
| Collapsible section | `<details>` + `<summary>` + `<div>`. Same `name` for one-open-at-a-time | FAQs, advanced settings, filter groups |
| Show more text | `div.expander` |  |
| File tree | `<ul class="tree">` |  |
| Tabs (same page) | `section.tabs` with radio inputs in `header[role=tablist]` |  |
| Tabs (links between pages) | `<nav class="tab-links">` with `aria-current="page"` |  |
| Breadcrumbs | `<nav aria-label="Breadcrumb"><ol>` |  |
| Pagination | `<nav class="pagination">` |  |
| Dropdown or menu | `[popover]` + `<menu>`. Nested menus with `data-placement="right top"` |  |
| Floating panel | `[popover]` with an `<article>` inside | Notification lists, quick forms, share panels |
| Modal | `<dialog>` + `<article>` | Confirmations, forms, login and signup |
| Side panel | `<dialog class="drawer" data-position="right">`, or `<div popover class="drawer">` without a backdrop |  |
| Toast | `<div popover class="toast">` |  |
| Tooltip | `data-tooltip` + `aria-label` |  |
| Heading with subtitle | `<hgroup>` with a heading and a `<p>` (heading group) | Card titles, form titles, page headers |
| Keyboard shortcut | `<kbd>` | Shortcut hints in menus, buttons and search inputs |
| Article text | `.prose`, `<hgroup>`, `<blockquote>` |  |
| Chat messages | `ol.chat`: one `<li>` per turn, one `<p>` per bubble, `li.sent` for the current user, `p.typing` for the typing dots | Support chats, AI assistants, comment threads |
| Elevation | `.shadow-1` to `.shadow-5`, `.shadow-inset-1` to `-3`, `.shadow-shiny-1` to `-3`. Or `var(--ui-shadow-*)` in CSS | Raised cards, wells, glossy buttons |
| Text size | `.text-xs` to `.text-9xl`. Responsive with `md:` (600px) and `lg:` (1200px), like `text-2xl md:text-4xl` | Hero titles, stat numbers, fine print |
| Row, column or grid | Flow helpers: `.flex`, `.flex-col`, `.flex-center`, `.grid`, `.gap-1` to `.gap-8` | Button rows, centered empty states |
| Divider | `<hr>`. With a label: `<hr data-label="...">` | "OR" between login options, section breaks in menus and cards |
| Scrolling logos or tags | `div.marquee` |  |
| Bar chart | `<table class="chart">` |  |

For larger UI built from these parts (login card, settings page, table with toolbar, pricing card), see [rules/recipes.md](./rules/recipes.md).

Anything in this table that the key patterns above don't show: fetch `https://ui.erikt.me/components/<name>` before you write the markup. Don't guess class names.

## Workflow

1. **Check the setup.** Find the stylesheet `<link>` or `@import`. Note the framework (plain HTML, React, Vue, Svelte) and whether Tailwind is present.
2. **Pick components** from the table above. Prefer one that exists over custom markup.
3. **Read the docs page** for any component you haven't used in this session.
4. **Write the markup.** Add layout with `flex`/`grid` only. Add no colors, borders or padding.
5. **Review** against the critical rules. Look for inline styles that aren't layout, hex colors, wrapper `div`s around native elements, and custom JS that the platform already does.

## Matching a design

When you match a screenshot or mockup, get close with the library's components and tokens. Don't pixel-match with overrides. A result that is 90% right with plain erikt/ui markup beats one that is 100% right but full of one-off styles.

If the design needs a real change, change it globally. Set seed variables on `:root`, or write one unlayered rule for the element. Use a per-element override only for something that appears once.

## Theming

Override seed variables on `:root`. Every color scale (50 to 950) derives from its seed.

```css
:root {
  --ui-primary: dodgerblue; /* or light-dark(blue, lightblue) */
  --ui-neutral: #8b8c93;
  --ui-constructive: #5dbb55; /* success */
  --ui-destructive: #ef5655; /* danger */
  --ui-color1: crimson; /* accents, color1 to color6 */
  --ui-rounded-scale: 1.75; /* default. 0 = square, 2 = twice the base */
  --ui-rounded: 2px; /* seed for --ui-rounded-1 to -8 */
  --ui-spacing: 0.25em; /* base step for --ui-spacing-1 to -8 */
  --ui-shadow-color: oklch(0% 0 0 / 0.12); /* tints every shadow */
}
```

Force a theme with `color-scheme`:

```css
:root {
  color-scheme: dark; /* or light */
}
```

To theme one part of the page, add `data-ui-theme` to it and set seeds there. Without the attribute, a seed on a smaller element does not update the scales built from it.

```html
<section data-ui-theme style="--ui-primary: crimson; --ui-rounded-scale: 2">...</section>
```

More in [rules/styling.md](./rules/styling.md).

## Detailed references

- [rules/forms.md](./rules/forms.md): field, validation, prefix and suffix, fieldsets, switches, toggle groups, select
- [rules/composition.md](./rules/composition.md): card, alert, badge, empty, loading, buttons vs links, tabs, typography, heading group
- [rules/overlays.md](./rules/overlays.md): popover, menu, dialog, drawer, tooltip, toast
- [rules/styling.md](./rules/styling.md): tokens, radius scale, shadows, transitions, text sizes, layout, overrides, icons, dark mode
- [rules/recipes.md](./rules/recipes.md): login card, settings page, confirmation modal, table with toolbar, stat tiles, pricing card
- [rules/frameworks.md](./rules/frameworks.md): React, Vue, Svelte and Tailwind
