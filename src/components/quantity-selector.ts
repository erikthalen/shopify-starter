/**
 * Quantity logic around markup the caller renders, e.g. in `snippets/cart-item.liquid`.
 * Reads `name`, `value`, `min` and `max` from its own attributes, and renders a
 * hidden input with the value so it's submitted with the surrounding form.
 * `[data-ref-decrease]` and `[data-ref-increase]` buttons change the value, and
 * every `[data-ref-output]` shows it. Each change dispatches a bubbling `change`
 * event on the hidden input, so a form can react with `hx-trigger="change"`.
 *
 * <quantity-selector name="quantity" value="1" min="1" max="10">
 *   <button type="button" data-ref-decrease>-</button>
 *   <span data-ref-output>1</span>
 *   <button type="button" data-ref-increase>+</button>
 * </quantity-selector>
 */
class QuantitySelector extends HTMLElement {
  static observedAttributes = ["name", "value", "min", "max"]

  #abortController = new AbortController()
  #inputElement = Object.assign(document.createElement("input"), {
    type: "hidden",
  })

  get #value() {
    return Number(this.getAttribute("value")) || 0
  }

  get #min() {
    const min = this.getAttribute("min")
    return min === null ? -Infinity : Number(min)
  }

  get #max() {
    const max = this.getAttribute("max")
    return max === null ? Infinity : Number(max)
  }

  connectedCallback() {
    this.#abortController = new AbortController()
    const { signal } = this.#abortController

    this.addEventListener(
      "click",
      e => {
        const buttonElement = (e.target as Element).closest(
          "[data-ref-decrease], [data-ref-increase]"
        )
        if (!buttonElement) return

        const step = buttonElement.hasAttribute("data-ref-decrease") ? -1 : 1
        this.#setValue(this.#value + step)
      },
      { signal }
    )

    this.#render()
  }

  disconnectedCallback() {
    this.#abortController.abort()
  }

  // also runs when an htmx morph updates the attributes from the server
  attributeChangedCallback() {
    if (this.isConnected) this.#render()
  }

  #setValue(value: number) {
    value = Math.min(this.#max, Math.max(this.#min, value))
    if (value === this.#value) return

    // renders through attributeChangedCallback, before the change event is sent
    this.setAttribute("value", String(value))
    this.#inputElement.dispatchEvent(new Event("change", { bubbles: true }))
  }

  #render() {
    const value = this.#value

    // an htmx morph removes the input, since the server markup doesn't have it
    if (!this.contains(this.#inputElement)) this.append(this.#inputElement)
    this.#inputElement.name = this.getAttribute("name") ?? "quantity"
    this.#inputElement.value = String(value)

    for (const outputElement of this.querySelectorAll("[data-ref-output]")) {
      outputElement.textContent = String(value)
    }

    for (const buttonElement of this.querySelectorAll<HTMLButtonElement>(
      "[data-ref-decrease]"
    )) {
      buttonElement.disabled = value <= this.#min
    }

    for (const buttonElement of this.querySelectorAll<HTMLButtonElement>(
      "[data-ref-increase]"
    )) {
      buttonElement.disabled = value >= this.#max
    }
  }
}

if (!customElements.get("quantity-selector")) {
  customElements.define("quantity-selector", QuantitySelector)
}
