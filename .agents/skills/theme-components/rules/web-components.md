# Web components

## Contents

- When to use one
- File and registration
- Markup stays in Liquid
- Refs: `data-ref-*`
- Naming inside the class
- Listeners and cleanup
- State as classes
- Working with htmx
- Full example

---

## When to use one

Use a custom element when a component needs client-side logic, like listeners, timers, fetching or coordinating several elements. When htmx attributes, native HTML (`<dialog>`, `<details>`, `popover`) or a short inline `onclick` can do it, don't add a component.

---

## File and registration

One element per file in `src/components/`, named after the element: `<predictive-search>` lives in `src/components/predictive-search.ts`. Import the file in `src/theme.ts`.

```ts
class PredictiveSearch extends HTMLElement {
  ...
}

if (!customElements.get("predictive-search")) {
  customElements.define("predictive-search", PredictiveSearch)
}
```

Start the file with a short comment saying which Liquid file it belongs to and what it does.

Functions that don't use `this` go outside the class, as plain module-level functions.

---

## Markup stays in Liquid

The element is rendered by Liquid, with all its children. JavaScript never builds markup. It only changes state on markup that exists, or inserts HTML the server rendered (a Section Rendering API response).

The one exception is a hidden input that carries the component's value into a form, like `<quantity-selector>`'s. The component renders it from its own attributes (`name`, `value`), so callers only render the visible parts. An htmx morph removes it, because the server markup doesn't have it, so re-create it on every render.

In a snippet, the custom element is usually the root element and carries the root class:

```liquid
<cart-notification class="cart-notification">
  <dialog data-ref-dialog class="notification-dialog"></dialog>
</cart-notification>
```

Custom elements are `display: inline` by default. Give the root a `display` in the stylesheet, or `display: contents` when it only groups its children.

An element that callers render directly, without a snippet (like `<quantity-selector>` or `<double-range>`), has no Liquid file of its own. Each caller styles its own markup. Base styles the element needs to work at all, like `<double-range>`'s shared track, go in a CSS file next to the component (`src/components/double-range.css`), imported in `src/theme.css`. Don't add them from the script: the module script runs after the first paint, so the element would flash unstyled.

---

## Refs: `data-ref-*`

Mark every element the class looks up with `data-ref-<name>`. Attributes that carry a value keep a descriptive name instead (`data-term="Hoodie"`).

**Incorrect:**

```liquid
<input class="search-input" name="q">
```

```ts
this.querySelector(".search-input")
```

**Correct:**

```liquid
<input class="search-input" name="q" data-ref-input>
```

```ts
this.querySelector("[data-ref-input]")
```

Classes are for styling and can be renamed for that reason alone. A `data-ref-*` attribute says "JavaScript depends on this".

Look refs up in private getters, not once in `connectedCallback`. htmx swaps can replace children, and a getter always returns the current element.

```ts
get #inputElement() {
  return this.querySelector<HTMLInputElement>("[data-ref-input]")!
}
```

---

## Naming inside the class

- Use private fields and methods (`#search()`, `#debounceTimeout`) for everything that isn't a lifecycle callback.
- Names that hold an element end in `Element`: `#inputElement`, `#dialogElement`, `const suggestionElement = …`.
- Make a method public only when code outside the element needs to call it, like `cartNotification.showVariant(id)`. Then export the class and add it to `HTMLElementTagNameMap`, so `document.querySelector("cart-notification")` is typed:

  ```ts
  export class CartNotification extends HTMLElement { ... }

  declare global {
    interface HTMLElementTagNameMap {
      "cart-notification": CartNotification
    }
  }
  ```

---

## Listeners and cleanup

Create an `AbortController` in `connectedCallback`, pass its `signal` to every listener, and abort it in `disconnectedCallback`. Clear timers there too.

Listen on the element itself and check the target, instead of on each child. One listener covers children that htmx swaps in later.

```ts
connectedCallback() {
  this.#abortController = new AbortController()
  const { signal } = this.#abortController

  this.addEventListener(
    "click",
    e => {
      const suggestionElement = (e.target as Element).closest<HTMLElement>("[data-term]")
      if (!suggestionElement) return
      ...
    },
    { signal }
  )
}

disconnectedCallback() {
  this.#abortController.abort()
  clearTimeout(this.#debounceTimeout)
}
```

Listeners on `document` (htmx events, for example) use the same `signal`.

---

## State as classes

Show state by toggling a class (or attribute) on the element, and style it in the Liquid file's stylesheet. Don't set inline styles from JavaScript. The exception is a continuous value, like a slider position: set it as a custom property (`this.style.setProperty("--min-pct", …)`) and use it in CSS.

```ts
this.classList.toggle("has-input", q !== "")
```

```css
.predictive-search {
  .search-content {
    &:not(.has-input) {
      .predictive-search-results {
        display: none;
      }
    }
  }
}
```

---

## Working with htmx

Let htmx do the requests. Put the `hx-*` attributes on a form in the markup and submit it from the class with `requestSubmit()`, instead of calling `fetch`.

- To cancel a pending request, dispatch `htmx:abort` on the form. The loading-states extension clears its states on that event.
- When the response is a Section Rendering API section, select its children into the target (`hx-select=".predictive-search-results > *"`), see the CSS rules.

Fetch directly only when the response isn't swapped by htmx, like `cart-notification`, which pre-fetches a section while the add-to-cart request is still running.

---

## Full example

```liquid
<predictive-search class="search-content">
  <form class="search-form" action="{{ routes.search_url }}">
    <input name="q" data-ref-input>
    <button type="reset" aria-label="Clear search">
      {% render 'icon', name: 'cross' %}
    </button>
  </form>

  <form
    class="sr-only"
    data-ref-form
    hx-get="{{ routes.predictive_search_url }}"
    hx-select=".predictive-search-results > *"
    hx-target="#predictive-search-results"
    hx-sync="this:replace"
  >
    <input type="search" name="q">
    <input type="hidden" name="section_id" value="predictive-search-results">
  </form>

  <section
    id="predictive-search-results"
    class="predictive-search-results"
    data-ref-results
  ></section>
</predictive-search>
```

```ts
/**
 * Live search for `blocks/_predictive-search.liquid`.
 */
class PredictiveSearch extends HTMLElement {
  #abortController = new AbortController()
  #debounceTimeout?: ReturnType<typeof setTimeout>

  get #inputElement() {
    return this.querySelector<HTMLInputElement>("[data-ref-input]")!
  }

  get #formElement() {
    return this.querySelector<HTMLFormElement>("[data-ref-form]")!
  }

  get #resultsElement() {
    return this.querySelector<HTMLElement>("[data-ref-results]")!
  }

  connectedCallback() {
    this.#abortController = new AbortController()
    const { signal } = this.#abortController

    this.addEventListener(
      "input",
      e => {
        if (e.target !== this.#inputElement) return

        clearTimeout(this.#debounceTimeout)
        this.#debounceTimeout = setTimeout(() => this.#search(), 250)
        this.#update()
      },
      { signal }
    )
  }

  disconnectedCallback() {
    this.#abortController.abort()
    clearTimeout(this.#debounceTimeout)
  }

  // runs on every change, not debounced, so emptying the input is instant
  #update() {
    const q = this.#inputElement.value
    this.classList.toggle("has-input", q !== "")

    if (q !== "") return

    clearTimeout(this.#debounceTimeout)
    // abort an in-flight request so its response can't fill the results again
    this.#formElement.dispatchEvent(new Event("htmx:abort"))
    this.#resultsElement.replaceChildren()
  }

  #search() {
    const q = this.#inputElement.value
    if (q === "") return

    const formInputElement = this.#formElement.elements.namedItem(
      "q"
    ) as HTMLInputElement
    formInputElement.value = q
    this.#formElement.requestSubmit()
  }
}

if (!customElements.get("predictive-search")) {
  customElements.define("predictive-search", PredictiveSearch)
}
```
