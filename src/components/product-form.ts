import barba from "@barba/core"
import type { ProductData, VariantData } from "~/types"
import { defineComponent } from "~/utils/define"
import { allAvailableInOption } from "~/utils/all-available-in-option"

export default defineComponent(() => ({
  productData: undefined as ProductData | undefined,
  currentVariant: undefined as VariantData | undefined,

  parser(form: HTMLFormElement) {
    if (!this.productData) return

    const formData = new FormData(form)
    const formValues = Object.fromEntries(formData.entries())

    const variant = this.productData.variants.find(variant => {
      return variant.options.every((value, idx) => {
        if (!this.productData) return
        const { name } = this.productData.options[idx]
        return formValues[name] === value
      })
    })

    if (!variant?.id) return

    return {
      id: parseInt(variant.id.toString()),
      quantity: parseInt(formData.get("quantity")?.toString() || "1"),
    }
  },

  async init() {
    try {
      const res = await fetch(window.location.pathname + ".js")
      this.productData = await res.json()

      this.disableNonAvailableOptions(this.$root as HTMLFormElement)

      console.log(this.productData)
    } catch (error) {
      console.log(error)
    }
  },

  handleChange(e: Event) {
    const form = (e.target as HTMLElement).closest("form")

    if (!form || !this.productData) return

    const data = this.parser(form)

    this.currentVariant = this.productData.variants.find(
      variant => variant.id === data?.id
    )

    this.disableNonAvailableOptions(form)

    this.updateURL()
  },

  disableNonAvailableOptions(form: HTMLFormElement) {
    const formData = new FormData(form)
    const formValues = Object.fromEntries(formData.entries())

    if (!this.productData) return

    const availableOptions = allAvailableInOption(
      this.productData,
      "Color",
      formValues["Color"]?.toString()
    )

    this.$root.querySelectorAll(`input[type="radio"]`).forEach(input => {
      if (input.getAttribute("name") === "Color") return

      if (input.parentElement) {
        input.parentElement.classList.add(
          "text-gray-400",
          "after:h-px",
          "after:w-[150%]",
          "after:-rotate-[18deg]",
          "after:absolute",
          "after:top-1/2",
          "after:left-1/2",
          "after:-translate-x-1/2",
          "after:-translate-y-1/2",
          "after:bg-zinc-300"
        )
      }
    })

    for (const option in availableOptions) {
      const inputs = this.$root.querySelectorAll(`input[name="${option}"]`)

      inputs.forEach(input => {
        const element = input as HTMLInputElement

        if (!element.parentElement) return

        if (!availableOptions[option].includes(element.value)) {
          element.parentElement.classList.add(
            "text-gray-400",
            "after:h-px",
            "after:w-[150%]",
            "after:-rotate-[18deg]",
            "after:absolute",
            "after:top-1/2",
            "after:left-1/2",
            "after:-translate-x-1/2",
            "after:-translate-y-1/2",
            "after:bg-zinc-300"
          )
        } else {
          element.parentElement.classList.remove(
            "text-gray-400",
            "after:h-px",
            "after:w-[150%]",
            "after:-rotate-[18deg]",
            "after:absolute",
            "after:top-1/2",
            "after:left-1/2",
            "after:-translate-x-1/2",
            "after:-translate-y-1/2",
            "after:bg-zinc-300"
          )
        }
      })
    }
  },

  updateURL() {
    const { id } = this.currentVariant || {}
    const url = new URL(window.location.href)

    if (!id) {
      url.searchParams.delete("variant")
    } else {
      url.searchParams.set("variant", id.toString())
    }

    barba.history.add(url.href, "popstate", "replace")
  },
}))
