import barba from "@barba/core"
import type { ProductData, VariantData } from "~/types"
import { defineComponent } from "~/utils/define"
import { getAvailableVariants } from "~/utils/get-available-variants"

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

    /**
     * It's only changes in the main option's values that will change what's enabled/disabled.
     * Say a product has "color" and "size" options; changing the color value will enable/disable
     * the size options, but changing the size value will keep the colors enable/disable state as they where.
     */
    const mainOptionName = this.productData.options[0].name

    const availableVariantsOfOptions = getAvailableVariants(this.productData, {
      name: mainOptionName,
      value: formValues[mainOptionName]?.toString(),
    })

    this.$root.querySelectorAll(`input[type="radio"]`).forEach(input => {
      const currentOption = availableVariantsOfOptions.current.find(
        option => option.name === input.getAttribute("name")
      )

      if (!currentOption) return

      const o = currentOption.values.find(
        o => o.value === input.getAttribute("value")
      )

      if (!!o?.variants.length) {
        // "disable" button
        input.parentElement?.classList.remove(
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
        // "enable" button
        input.parentElement?.classList.add(
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
