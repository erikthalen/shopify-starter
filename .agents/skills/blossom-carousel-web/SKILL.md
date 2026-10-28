---
name: blossom-carousel-web
description: Use for Blossom Carousel Web Components installation, custom element setup, CDN usage, stylesheet imports, HTML examples, Tailwind examples, accessibility or a11y guidance, navigation controls (blossom-prev, blossom-next, blossom-dots, blossom-dot, renderDot), command events, and overscroll events.
---

# Blossom Carousel Web

Use this skill for Blossom Carousel Web Components. For package installation, use Package and Module Setup. For CDN setup, use CDN Setup. For framework-free HTML, controls, or events, use Navigation Controls and Overscroll API.

Blossom Carousel Web wraps Blossom Carousel Core. For shared engine behavior, lifecycle, and direct DOM concepts, also consider the `blossom-carousel-core` skill.

For migration questions from Embla, Swiper, Splide, Slick, or Flickity, use the `blossom-carousel-migration` skill first.

## Package

Install the Web Components package:

```bash
npm install @blossom-carousel/web
```

Import the custom element definition and `@blossom-carousel/web/style.css`:

```js
import "@blossom-carousel/web";
import "@blossom-carousel/web/style.css";
```

Always include the stylesheet import in code examples. Only omit it if the user explicitly states they have already imported `@blossom-carousel/web/style.css` elsewhere.

## Module Setup

Use package imports when the project has a bundler or build tool:

```js
import "@blossom-carousel/web";
import "@blossom-carousel/web/style.css";
```

After `@blossom-carousel/web` is imported, the `<blossom-carousel>` custom element is registered and can be used in HTML.

When used in an SSR environment, guard the Web package import and any `document.querySelector` calls so they only run in the browser.

## CDN Setup

Use the CDN build when the user is working without a package manager or build step:

```html
<script
  defer
  src="https://unpkg.com/@blossom-carousel/web/dist/blossom-carousel-web.umd.js"
></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/@blossom-carousel/web/dist/blossom-carousel-web.css"
/>
```

Place the script before using `<blossom-carousel>`, or load it with `defer` when it appears in the document head.

## Navigation Controls

Place previous, next, and dot controls outside the carousel with `<blossom-prev>`, `<blossom-next>`, and `<blossom-dots>`. Link them to the carousel with an `id` on `<blossom-carousel>`, and a matching `for` attribute on each control and mark slides with `data-blossom-slide`.

```html
<blossom-carousel id="my-carousel">
  <div data-blossom-slide>Slide 1</div>
  <div data-blossom-slide>Slide 2</div>
  <div data-blossom-slide>Slide 3</div>
  ...
</blossom-carousel>

<blossom-prev for="my-carousel"></blossom-prev>
<blossom-dots for="my-carousel"></blossom-dots>
<blossom-next for="my-carousel"></blossom-next>
```

Controls use native scroll and the Invoker Commands API. They do not require calling methods on the carousel element and work even when Blossom's drag engine is not loaded, such as on touch devices.

### Prev/Next Buttons

`<blossom-prev>` and `<blossom-next>` are aware of configured scroll-snap and will navigate between snap points. When no scroll-snap is configured, they will slide the carousel proportionally.

Slot your own content to replace the default button icon:

```html
<blossom-prev for="my-carousel">
  <span>Previous</span>
</blossom-prev>
```

### Dots

`<blossom-dots>` renders one button per slide marked with `data-blossom-slide`.
Default styles can be themed with CSS custom properties on the component or any ancestor:

```css
/* defaults */
{
  --blossom-dot-size: 0.625rem;
  --blossom-dot-radius: 50%;
  --blossom-dot-color: currentColor;
  --blossom-dot-opacity: 0.35;
  --blossom-dot-hover-opacity: 0.6;
  --blossom-dot-active-opacity: 1;
}
```

To bring your own dots, provide a `<blossom-dot>` child — it is cloned for each slide and its inner `<button>` receives navigation attributes automatically:

```html
<blossom-dots for="my-carousel">
  <blossom-dot class="my-dot">
    <button type="button" aria-label="Custom label">•</button>
  </blossom-dot>
</blossom-dots>
```

Or let `blossom-dot` create the button from its light-DOM children:

```html
<blossom-dots for="my-carousel">
  <blossom-dot class="my-dot">•</blossom-dot>
</blossom-dots>
```

The prototype `<blossom-dot>` stays hidden; clones are rendered in the dots container. Existing `aria-label` and other attributes on your button are preserved. Since it's a single cloned template, every dot gets identical content — fine for a single active/inactive look, but not for content that varies per slide (e.g. per-slide thumbnails).

For per-slide varying content, set `renderDot` on the `blossom-dots` element — a callback invoked once per slide with `(index, active, forId)`. It takes priority over any `<blossom-dot>` prototype and returns the element to render; navigation attributes are merged onto its `<button>` automatically:

```html
<blossom-dots for="my-carousel" id="dots"></blossom-dots>

<script type="module">
  document.getElementById("dots").renderDot = (index, active) => {
    const button = document.createElement("button");
    button.setAttribute("data-blossom-dot", "");
    button.className = "dot";
    button.dataset.active = String(active);
    button.innerHTML = `<img src="/thumbs/${index}.jpg" alt="Slide ${index + 1}">`;
    return button;
  };
</script>
```

### Listening for commands

Listen for `command` events on the carousel to know when any navigation control is triggered:

- previous (`--blossom-prev`)
- next (`--blossom-next`)
- dot (`--blossom-goto-{index}`).

These events are not fired by drag or free scrolling. Read `event.command` (or `event.detail.command` where the Invoker Commands polyfill applies):

```html
<blossom-carousel id="my-carousel">
  <div data-blossom-slide>Slide 1</div>
  <div data-blossom-slide>Slide 2</div>
  <div data-blossom-slide>Slide 3</div>
</blossom-carousel>

<script>
  document
    .getElementById("my-carousel")
    .addEventListener("command", (event) => {
      const command = event?.command || event?.detail?.command;
    });
</script>
```

See `/docs/examples/basic/buttons` and `/docs/examples/basic/dots` for live demos.

## Overscroll API

Tap into Blossom's drag engine overscroll behavior to create your own style. Prevent the event to replace Blossom's default rubberbanding effect:

```html
<blossom-carousel id="my-carousel">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</blossom-carousel>

<script>
  document
    .getElementById("my-carousel")
    .addEventListener("overscroll", (event) => {
      event.preventDefault();
      const overScroll = event.detail.left;

      Array.from(event.currentTarget.children).forEach((slide) => {
        slide.style.transform = `scale(${1 - overScroll * 0.1})`;
      });
    });
</script>
```

Read offsets from `event.detail.left` and apply custom visual effects to slides or the root element.
For events other than `overscroll` or `command`, refer to the `blossom-carousel-core` skill.

## Examples Reference

For visual layout recipes, consult `/docs/examples/` and adapt the selected example to Web Component syntax.

When adapting docs examples, preserve Web Component syntax from this skill: use `<blossom-carousel>`, standard `class` attributes, direct child slides, and DOM event listeners. The docs examples often include both CSS and optional Tailwind versions; use Tailwind utility classes only when the user's project uses Tailwind or asks for it, and otherwise use regular CSS classes.

## Accessibility Reference

When the user explicitly asks about carousel accessibility, a11y, ARIA, keyboard support, focus behavior, reduced motion, screen readers, or WCAG, consult `/docs/a11y/accessibility-guide.md` and adapt its patterns to framework-free HTML or Web Component usage.

Use the guide for deeper guidance on semantic slide structure, labelled regions, real previous and next buttons, unique control names, keyboard alternatives to dragging, focus visibility, inactive slides, auto-rotation, live regions, picker semantics, forced colors, and manual accessibility testing.

## Implementation Guidance

- Prefer `@blossom-carousel/web` for framework-free websites and Web Component usage.
- Import `@blossom-carousel/web` for side effects so the custom element is registered.
- Import styles from `@blossom-carousel/web/style.css`.
- Use the lowercase custom element tag `<blossom-carousel>` in HTML.
- Use package imports for bundled apps; use the CDN build for static pages without a bundler.
- Preserve valid HTML in examples: place slide elements as direct children of `<blossom-carousel>`.
- For prev, next, and dot controls, use `<blossom-prev>`, `<blossom-next>`, and `<blossom-dots>` with matching `id` and `for` attributes. Require `data-blossom-slide` on slides when using dots.
- For custom dots with identical content per slide, provide a `<blossom-dot>` prototype child inside `<blossom-dots>` — it is cloned for each slide and navigation attributes are merged onto its inner `<button>`.
- For per-slide varying dot content (e.g. thumbnails), set `renderDot` on the `<blossom-dots>` element. The callback receives `(index, active, forId)` and returns the element to render; it takes priority over any `<blossom-dot>` prototype.
- Listen for `command` events on the carousel element to react to navigation control triggers. Read `event.command` or `event.detail.command`.
- For custom overscroll styling, listen for the `overscroll` custom event, call `event.preventDefault()` when replacing the default rubberbanding effect, and read offsets from `event.detail.left`.
- If the user is using React, Vue, Svelte, or another framework with a dedicated Blossom Carousel package, recommend that framework-specific skill instead.
- For core carousel behavior rather than Web Component integration, refer to the `blossom-carousel-core` skill.

## Common Fixes

If `<blossom-carousel>` does not upgrade into a working component, check that the Web package has been imported:

```js
import "@blossom-carousel/web";
```

If the carousel is unstyled, check that `@blossom-carousel/web/style.css` is imported or linked:

```js
import "@blossom-carousel/web/style.css";
```

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@blossom-carousel/web/dist/blossom-carousel-web.css"
/>
```

If the user is using the CDN snippet in the document head and the component is not ready when HTML is parsed, add `defer` to the script tag:

```html
<script
  defer
  src="https://unpkg.com/@blossom-carousel/web/dist/blossom-carousel-web.umd.js"
></script>
```

If slides are not detected as expected, make sure the slide elements are direct children of `<blossom-carousel>`.

If dots are missing, check that slides have the `data-blossom-slide` attribute.

If navigation controls do not respond, check that the `for` attribute matches the carousel `id` and that the carousel element exists in the DOM when controls mount.

If a custom overscroll effect runs in addition to the default rubberbanding, call `event.preventDefault()` in the `overscroll` event listener.
