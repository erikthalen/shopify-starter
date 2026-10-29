/**
 * Live search for `blocks/_predictive-search.liquid`.
 * Copies the visible input's value into a hidden htmx form, which fetches
 * the `predictive-search-results` section into `[data-ref-results]`.
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

    // the reset button. A reset fires no input event, and the event runs before
    // the fields are cleared, so clear the input here
    this.addEventListener(
      "reset",
      e => {
        if (e.target !== this.#inputElement.form) return

        this.#inputElement.value = ""
        this.#inputElement.focus()
        this.#update()
      },
      { signal }
    )

    // popular search suggestions
    this.addEventListener(
      "click",
      e => {
        const suggestionElement = (e.target as Element).closest<HTMLElement>(
          "[data-term]"
        )
        if (!suggestionElement) return

        e.preventDefault()
        this.#inputElement.value = suggestionElement.dataset.term ?? ""
        this.#inputElement.focus()
        this.#update()
        this.#search()
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
