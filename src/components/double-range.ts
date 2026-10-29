/**
 * A range slider with a minimum and a maximum handle, around markup the caller
 * renders, e.g. in `blocks/_collection-filter.liquid`. `[data-ref-min]` and
 * `[data-ref-max]` are two range inputs on one track, and can't pass each other.
 * Every `[data-ref-min-output]` and `[data-ref-max-output]` shows their value.
 * Sets `--min-pct` and `--max-pct` (0–1) for the filled part of the track,
 * styled in `double-range.css`.
 *
 * <double-range>
 *   <p><span data-ref-min-output>0</span> – <span data-ref-max-output>100</span></p>
 *   <input type="range" name="from" min="0" max="100" value="0" data-ref-min>
 *   <input type="range" name="to" min="0" max="100" value="100" data-ref-max>
 * </double-range>
 */
class DoubleRange extends HTMLElement {
  #abortController = new AbortController()

  get #minElement() {
    return this.querySelector<HTMLInputElement>("[data-ref-min]")!
  }

  get #maxElement() {
    return this.querySelector<HTMLInputElement>("[data-ref-max]")!
  }

  connectedCallback() {
    this.#abortController = new AbortController()
    const { signal } = this.#abortController

    this.addEventListener(
      "input",
      e => {
        const minElement = this.#minElement
        const maxElement = this.#maxElement
        const min = Number(minElement.value)
        const max = Number(maxElement.value)

        // the dragged handle stops at the other one
        if (e.target === minElement) {
          minElement.value = String(Math.min(min, max))
        } else if (e.target === maxElement) {
          maxElement.value = String(Math.max(min, max))
        } else {
          return
        }

        this.#render()
      },
      { signal }
    )

    this.#render()
  }

  disconnectedCallback() {
    this.#abortController.abort()
  }

  #render() {
    const minElement = this.#minElement
    const maxElement = this.#maxElement

    // both inputs share the same range
    const rangeMin = minElement.min === "" ? 0 : Number(minElement.min)
    const rangeMax = minElement.max === "" ? 100 : Number(minElement.max)
    const span = rangeMax - rangeMin || 1

    const min = Number(minElement.value)
    const max = Number(maxElement.value)

    // continuous values, so custom properties rather than classes
    this.style.setProperty("--min-pct", String((min - rangeMin) / span))
    this.style.setProperty("--max-pct", String((max - rangeMin) / span))

    // when the handles overlap, the one that can still move is on top
    this.classList.toggle("min-on-top", min > rangeMin + span / 2)

    for (const outputElement of this.querySelectorAll(
      "[data-ref-min-output]"
    )) {
      outputElement.textContent = String(min)
    }

    for (const outputElement of this.querySelectorAll(
      "[data-ref-max-output]"
    )) {
      outputElement.textContent = String(max)
    }
  }
}

if (!customElements.get("double-range")) {
  customElements.define("double-range", DoubleRange)
}
