# Styling

## Contents

- Use tokens, not raw values
- Radius uses the rounded scale
- Shadows use tokens
- Transitions use the ease variables
- CSS is for layout
- Change things once
- No `!important`
- Don't size icons
- No `z-index` on overlays
- Dark mode
- Component properties
- Token reference

---

## Use tokens, not raw values

**Incorrect:**

```css
.stat {
  color: #16a34a;
  border: 1px solid #e5e7eb;
  padding: 12px;
}
```

**Correct:**

```css
.stat {
  color: var(--ui-constructive-600);
  border: 1px solid var(--ui-neutral-200);
  padding: var(--ui-spacing-3);
}
```

Better still, check if a variant already does it. `<span class="badge constructive">` needs no CSS at all.

---

## Radius uses the rounded scale

Corner rounding has 8 steps, `--ui-rounded-1` to `--ui-rounded-8`, plus `--ui-rounded-full` for pills and circles. Pick the step that matches what the element is.

| Element | Token |
| --- | --- |
| Small inline things, like a tag or code chip | `--ui-rounded-2` |
| Controls, like buttons, inputs and menu items | `--ui-rounded-3` |
| Surfaces, like cards, panels and popovers | `--ui-rounded-5` |
| Pills and circles | `--ui-rounded-full` |

**Incorrect:**

```css
.panel {
  border-radius: 12px;
}
.pill {
  border-radius: 9999px;
}
```

**Correct:**

```css
.panel {
  border-radius: var(--ui-rounded-5);
}
.pill {
  border-radius: var(--ui-rounded-full);
}
```

Don't use `border-radius: 50%` or a large pixel value for circles. Those ignore `--ui-rounded-scale`, so they stay round when the user asks for square corners.

### Nested corners

Two steps next to each other differ by `--ui-spacing-1` times `--ui-rounded-scale`. To nest a rounded box in another, pad the outer box by the difference between the two steps. The corners then run parallel.

```css
.outer {
  border-radius: var(--ui-rounded-5);
  padding: calc(var(--ui-spacing-3) * var(--ui-rounded-scale)); /* 5 - 2 = 3 */
}
.inner {
  border-radius: var(--ui-rounded-2);
}
```

### Changing the roundness

To make the whole UI rounder or sharper, set `--ui-rounded-scale` on `:root`. Don't override single steps for this.

```css
:root {
  --ui-rounded-scale: 0; /* square corners everywhere */
}
```

| Property | Default | Effect |
| --- | --- | --- |
| `--ui-rounded-scale` | `1.75` | Multiplies every step and `--ui-rounded-full`. `0` is square |
| `--ui-rounded` | `2px` | The seed that every step starts from |

The library computes the steps on `:root`. Setting `--ui-rounded-scale` or `--ui-rounded` on a smaller element does nothing, unless that element has `data-ui-theme` (see [Scoped themes](#scoped-themes)). Without it, set the steps there:

```css
.sidebar {
  --ui-rounded-3: 0;
  --ui-rounded-5: 0;
}
```

---

## Shadows use tokens

Shadows go from `--ui-shadow-1` (smallest) to `--ui-shadow-5` (largest). `--ui-shadow-inset-1` to `-3` make a surface look pressed in. `--ui-shadow-shiny-1` to `-3` add a lit rim and look glossy. Each `-0` is no shadow.

Every token has a class with the same name, without `--ui-`: `.shadow-2`, `.shadow-inset-1`, `.shadow-shiny-3`. Use the class on an element that has no CSS of its own.

**Incorrect:**

```css
.panel {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.panel:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

**Correct:**

```css
.panel {
  box-shadow: var(--ui-shadow-2);
  transition: box-shadow var(--ease-glide-3);
}
.panel:hover {
  box-shadow: var(--ui-shadow-4);
}
```

- Every shadow has the same four layers, so one animates into another. To animate in from nothing, start at `--ui-shadow-0`, not `none`.
- Tint shadows with `--ui-shadow-color` on `:root` or on any parent. Tint the shine of the shiny shadows with `--ui-shadow-shine-color`.
- To add your own layer, put it after the token, separated by a comma. Give both states of a transition the same number of layers.

---

## Transitions use the ease variables

Each curve has five ready-made pairs of duration and curve. Put the property in front. Don't add a duration, the variable has one.

| Curve | Variables | Durations | Use for |
| --- | --- | --- | --- |
| Glide | `--ease-glide-1` to `-5` | `100ms`, `150ms`, `200ms`, `300ms`, `400ms` | The default. Hover states, popovers, dialogs, drawers |
| Snap | `--ease-snap-1` to `-5` | `400ms`, `550ms`, `750ms`, `1000ms`, `1300ms` | Small overshoot. Toasts, toggles, selections |
| Heavy | `--ease-heavy-1` to `-5` | `600ms`, `700ms`, `850ms`, `1000ms`, `1200ms` | Big elastic overshoot. One per screen at most |

**Incorrect:**

```css
.panel {
  transition: opacity 200ms ease-out, translate 300ms ease-out;
}
```

**Correct:**

```css
.panel {
  transition:
    opacity var(--ease-glide-3),
    translate var(--ease-glide-4);
}
```

For a duration that isn't in the list, use the curve alone: `transition: opacity 250ms var(--ease-glide)`. For longhands like `animation-timing-function`, also use the curve alone.

The classic curves are there too: `--ease-in-*`, `--ease-out-*` and `--ease-in-out-*`, each in `sine`, `quad`, `cubic`, `quart`, `quint`, `expo`, `circ` and `back`.

---

## CSS is for layout

Write `flex` and `grid` yourself, or use the flow helpers below. Leave the look of components alone.

| Class | Does |
| --- | --- |
| `.flex`, `.flex-col` | A row or a column |
| `.flex-center`, `.flex-col-center` | Centered on both axes. Add `-x` or `-y` to center on one axis only |
| `.grid` | A grid |
| `.gap-1` to `.gap-8` | The gap, from `--ui-spacing-1` to `--ui-spacing-8` |

For anything else, like columns or wrapping, write the CSS.

**Incorrect:**

```html
<div style="display: flex; gap: 8px">
  <button style="background: #2563eb; border-radius: 6px; padding: 8px 16px">Save</button>
</div>
```

**Correct:**

```html
<div class="flex gap-2">
  <button>Save</button>
</div>
```

Use a class in a stylesheet instead of inline `style` when the same layout appears more than once.

---

## Change things once

To match a brand or a mockup, change the seed variables on `:root`. Every component follows.

**Incorrect:**

```html
<button style="background: purple">Save</button>
<span class="badge" style="background: purple">New</span>
<a style="color: purple">Link</a>
```

**Correct:**

```css
:root {
  --ui-primary: purple;
}
```

To change one component everywhere, write one unlayered rule:

```css
summary:hover {
  text-decoration-color: transparent;
}
```

To change one area, give it `data-ui-theme` and set the seeds there:

```html
<aside data-ui-theme class="sidebar">...</aside>
```

```css
.sidebar {
  --ui-primary: var(--ui-color5);
}
```

### Scoped themes

The color scales (`--ui-primary-50` to `-950`), the rounding steps and the spacing steps are computed on `:root`. A seed set on a smaller element changes only the seed. The scales keep the `:root` values.

`data-ui-theme` makes the element compute its own copy of every token. Seeds set on it then reach every scale inside.

- It follows the page's light or dark mode. Set `color-scheme` on it to force one.
- It resets inherited tokens. Seeds set on `:root` do not reach inside, so set them on the element itself.

---

## No `!important`

All erikt/ui styles live in `@layer ui`. Unlayered CSS always beats a layer, whatever the specificity. If your rule doesn't apply, it is probably inside another `@layer` that comes earlier. Move it out of the layer.

---

## Don't size icons

SVGs are `1lh` wide and high, so they match the line of text they sit in. They use `currentColor`. The docs use [Tabler icons](https://tabler.io/icons) as inline SVG.

**Incorrect:**

```html
<button><svg width="16" height="16" style="margin-right: 6px; color: white">...</svg> Save</button>
```

**Correct:**

```html
<button><svg><!-- icon --></svg> Save</button>
```

To make an icon bigger, change the `font-size` of its container.

---

## No `z-index` on overlays

`<dialog>`, `[popover]`, toasts and drawers render in the top layer. They are always above the page. Adding `z-index` does nothing and hides the real problem if something looks wrong.

---

## Dark mode

The library sets `color-scheme: light dark`. All tokens use `light-dark()`, so they switch with the system theme.

**Incorrect:**

```css
@media (prefers-color-scheme: dark) {
  .card { background: #111; color: #eee; }
}
```

**Correct:** use tokens and do nothing else. To force a theme:

```css
:root {
  color-scheme: dark; /* or light */
}
```

For a custom seed that needs two values, use `light-dark()`:

```css
:root {
  --ui-primary: light-dark(royalblue, lightskyblue);
}
```

---

## Component properties

Some components read their own variables. Set them on the element, not on `:root`.

| Component | Property |
| --- | --- |
| Table | `--cols` (grid columns, for example `2fr 1fr 80px`) |
| Description list | `--ui-description-list-label` (label column width) |
| Timeline | `--ui-timeline-gap`, `--ui-timeline-color`, `--ui-timeline-dot` |
| Carousel | `--visible` (slides shown at once) |
| Marquee | `--marquee-duration` |
| Expander | `--lines` (lines shown when closed) |
| Color swatch | `--swatch-color` |
| Input OTP | `--otp-length` (set from `maxlength` on its own) |
| Prose | `--ui-typography-spacing` |

---

## Token reference

| Token | Values |
| --- | --- |
| Neutral scale | `--ui-neutral-0`, `-50`, `-100` to `-900`, `-950`, `-1000` |
| Color scales | `--ui-primary-*`, `--ui-constructive-*`, `--ui-destructive-*`, `--ui-color1-*` to `--ui-color6-*`, each `50` to `950` |
| Seeds | `--ui-primary`, `--ui-neutral`, `--ui-constructive`, `--ui-destructive`, `--ui-color1` to `--ui-color6` |
| Spacing | `--ui-spacing` (base, `0.25em`), `--ui-spacing-1` to `--ui-spacing-8` |
| Radius | `--ui-rounded-scale` (multiplier, `1`), `--ui-rounded` (seed, `2px`), `--ui-rounded-1` to `--ui-rounded-8`, `--ui-rounded-full` (pills and circles). Controls use `-3`, cards and dialogs `-5` |
| Surface | `--ui-background-color`, `--ui-text-color` |
| Text size | `--ui-text-xs`, `-sm`, `-base`, `-lg`, `-xl`, `-2xl` to `-9xl`. Classes `.text-xs` to `.text-9xl`, with `md:` and `lg:` prefixes |
| Shadow | `--ui-shadow-0` to `-5`, `--ui-shadow-inset-0` to `-3`, `--ui-shadow-shiny-0` to `-3`. Color: `--ui-shadow-color`, `--ui-shadow-shine-color` |
| Classic easing | `--ease-in-*`, `--ease-out-*`, `--ease-in-out-*` in `sine`, `quad`, `cubic`, `quart`, `quint`, `expo`, `circ`, `back` |
| Easing | `--ease-glide`, `--ease-snap`, `--ease-heavy` |
| Transition | `--ease-glide-1` to `-5`, `--ease-snap-1` to `-5`, `--ease-heavy-1` to `-5` (duration + curve). Use as `transition: opacity var(--ease-glide-3)` |

Use `--ui-neutral-500` for muted text and `--ui-neutral-200` or `-300` for borders.
