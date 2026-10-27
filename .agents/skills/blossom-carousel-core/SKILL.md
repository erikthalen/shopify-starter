---
name: blossom-carousel-core
description: Use when working with Blossom Carousel Core, the framework-agnostic carousel engine, APIs, options, events, navigation controls, overscroll behavior, lifecycle, layout examples, optional Tailwind examples, accessibility or a11y guidance, and integration patterns.
---

# Blossom Carousel Core

Use this skill for direct `@blossom-carousel/core` usage outside framework wrappers: framework-agnostic behavior, manual Blossom instance creation or teardown, direct DOM integration, or shared engine behavior used by the Web, React, Svelte, and Vue packages.

Blossom Carousel Core is the foundation package for the framework-specific integrations. Use this skill for shared carousel lifecycle, lazy loading, initialization, teardown, and direct DOM integration.

For migration questions from Embla, Swiper, Splide, Slick, or Flickity, use the `blossom-carousel-migration` skill first.

## Package

Install the Core package:

```bash
npm install @blossom-carousel/core
```

Import `Blossom` and the core stylesheet:

```js
import { Blossom } from "@blossom-carousel/core";
import "@blossom-carousel/core/style.css";
```

The stylesheet should be imported once in the app entry file, layout, or module that owns the carousel setup.

## Basic Setup

Create a Blossom instance from a carousel root element, then initialize it when ready:

```js
import { Blossom } from "@blossom-carousel/core";
import "@blossom-carousel/core/style.css";

const element = document.querySelector("#my-carousel-element");

const blossom = Blossom(element, { repeat: false });

blossom.init();
```

The selected element should be the carousel root. Its direct children are treated as slides.

The object returned by `Blossom(element)` is the Blossom instance. Use that instance for `init()` and `destroy()`.
If you need non-default behavior, pass a second `options` object such as `{ repeat: true }`; see the Options section below.
The only documented init-time option today is `repeat`.

When writing robust examples, check that the element exists before creating the instance:

```js
import { Blossom } from "@blossom-carousel/core";
import "@blossom-carousel/core/style.css";

const element = document.querySelector("#my-carousel-element");

if (element) {
  const blossom = Blossom(element);

  blossom.init();
}
```

If the root element has no children, `init()` is a no-op; make sure slide elements are present in the DOM before initializing.

## Options

`Blossom(element, options)` currently accepts a small options object.

If you do not need looping behavior, omit the options object.

| Option   | Type      | Default | Purpose                                                                          |
| -------- | --------- | ------- | -------------------------------------------------------------------------------- |
| `repeat` | `boolean` | `false` | Enables repeating carousel behavior and adds repeat padding to the root element. |

```js
const blossom = Blossom(element, { repeat: true });
```

## Lazy Loading

Load Blossom only when the carousel engine is needed. Check pointer capability first, then import Core and initialize the carousel:

```js
const hasMouse = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

if (hasMouse) {
  const element = document.querySelector("#my-carousel-element");

  if (element) {
    const { Blossom } = await import("@blossom-carousel/core");

    const blossom = Blossom(element);

    blossom.init();
  }
}
```

## Destroy

Destroy the Blossom instance when it is no longer needed to free up resources:

```js
blossom.destroy();
```

Call `destroy()` during teardown, route changes, component unmounting, or whenever the carousel root will be removed from the DOM.

## Overscroll API

Listen for the `overscroll` event when the user wants to customize Blossom's drag engine overscroll behavior. Prevent the event to replace Blossom's default rubberbanding effect:

```js
const element = document.querySelector("#blossom-carousel");

element.addEventListener("overscroll", (event) => {
  event.preventDefault();

  const overScroll = event.detail.left;

  Array.from(element.children).forEach((slide) => {
    slide.style.transform = `scale(${1 - overScroll * 0.1})`;
  });
});
```

Read overscroll values from `event.detail`, such as `event.detail.left`, and apply custom visual effects to the carousel slides or root element.

## Events

Blossom emits these events on the carousel root element:

| Event                | Detail                           |
| -------------------- | -------------------------------- | ---------------------------------- | ------- |
| `overscroll`         | `{ left: number }`               |
| `scrollend`          | none                             |
| `scrollsnapchange`   | `{ snapTargetInline: HTMLElement | null, snapTargetBlock: HTMLElement | null }` |
| `scrollsnapchanging` | `{ snapTargetInline: HTMLElement | null, snapTargetBlock: HTMLElement | null }` |

Use `event.preventDefault()` on `overscroll` when replacing Blossom's default rubberbanding effect.

## Accessibility

Use a labelled region for the carousel, keep previous and next controls as real `<button>` elements, and provide clear button names such as "Previous slide" and "Next slide".

Make the carousel keyboard-friendly by keeping focusable controls adjacent to the carousel and preserving visible focus styles.

Respect reduced motion when you add extra motion around the carousel.

## Implementation Guidance

- Prefer `@blossom-carousel/core` for framework-agnostic usage, direct DOM integration, and shared engine behavior.
- Import `Blossom` as a named export: `import { Blossom } from "@blossom-carousel/core"`.
- Import styles from `@blossom-carousel/core/style.css`.
- Initialize with `blossom.init()` after creating the instance.
- Call `blossom.destroy()` when the instance is no longer needed.
- Treat the selected element as the carousel root and its direct children as slides.
- Use dynamic `import("@blossom-carousel/core")` when lazy loading the engine.
- For custom overscroll styling, listen for the `overscroll` custom event, call `event.preventDefault()` when replacing the default rubberbanding effect, and read offsets from `event.detail.left`.
- When writing examples for framework packages, prefer the matching Blossom Carousel wrapper skill. Use this Core skill for behavior that applies across Web, React, Svelte, and Vue.

## Common Fixes

If the carousel is unstyled, check that the core stylesheet is imported:

```js
import "@blossom-carousel/core/style.css";
```

If initialization fails, check that `document.querySelector()` found an element before calling `Blossom(element)`:

```js
const element = document.querySelector("#my-carousel-element");

if (!element) return;
```

If slides are added or removed after initialization, destroy the current instance and create a new one so Blossom can recompute layout.

If carousel behavior is duplicated after page transitions or component remounts, make sure the old instance is destroyed before creating a new one:

```js
blossom.destroy();
```

Do not call `init()` more than once per instance, and do not call instance methods after `destroy()`.

If the user wants to avoid loading the carousel engine on touch devices, use the hover and pointer media query before dynamically importing Core.

If a custom overscroll effect runs in addition to the default rubberbanding, call `event.preventDefault()` in the `overscroll` event listener.
