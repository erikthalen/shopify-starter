import { ProductData } from '~/types'

type Option = {
  name: string
  position?: number
  values?: string[]
}

export function allAvailableInOption(
  productData: ProductData,
  relativeTo: string,
  currentChoice: string
) {
  const result: Record<string, any> = []

  const getIndex = (option: Option) =>
    productData.options.findIndex(o => o.name === option.name)

  const allOtherOptions = productData.options.filter(
    option => option.name !== relativeTo
  )

  const targetIdx = getIndex({ name: relativeTo })

  allOtherOptions.forEach(option => {
    const idx = getIndex(option)

    const variantOfChoice = productData.variants.filter(
      variant => variant.options[targetIdx] === currentChoice
    )

    variantOfChoice.forEach(variant => {
      const value = variant.options[idx]

      if (variant.available) {
        result[option.name] = result[option.name] || []

        result[option.name].push(value)
      }
    })
  })

  return result
}
