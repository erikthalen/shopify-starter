import { ProductData, VariantData } from "~/types"

/**
 * Given currently selected product option(s), it returns the amount of available variants that shares that option.
 * Used to disable input fields in a variant selector.
 */
export function getAvailableVariants(
  productData: ProductData,
  relativeTo: { name: string; value: string }
) {
  const indexOfCurrentlySelected = productData.options.findIndex(
    o => o.name === relativeTo.name
  )

  const all = []
  const current = []

  for (const option of productData.options) {
    const opt = {
      name: option.name,
      values: [] as { value: string; variants: VariantData[] }[],
    }

    // collect all available
    for (const value of option.values) {
      const res = { value, variants: [] as VariantData[] }

      for (const variant of productData.variants) {
        if (
          variant.options[option.position - 1] === value &&
          variant.available
        ) {
          res.variants.push(variant)
        }
      }

      opt.values.push(res)
    }

    all.push(opt)

    // collect available relative to currently selected

    const opt2 = {
      name: option.name,
      values: [] as { value: string; variants: VariantData[] }[],
    }

    for (const value of option.values) {
      const res = { value, variants: [] as VariantData[] }

      for (const variant of productData.variants) {
        if (option.name !== relativeTo.name) {
          if (
            variant.options[option.position - 1] === value &&
            variant.options[indexOfCurrentlySelected] === relativeTo.value &&
            variant.available
          ) {
            res.variants.push(variant)
          }
        } else {
          if (
            variant.options[option.position - 1] === value &&
            variant.available
          ) {
            res.variants.push(variant)
          }
        }
      }

      opt2.values.push(res)
    }
    current.push(opt2)
  }

  return {
    all,
    current,
    active: relativeTo,
  }
}
