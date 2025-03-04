// https://app.quicktype.io/

export type Product = {
  id: number
  title: string
  handle: string
  description: string
  published_at: Date
  created_at: Date
  vendor: string
  type: string
  tags: string[]
  price: number
  price_min: number
  price_max: number
  available: boolean
  price_varies: boolean
  compare_at_price: null | number
  compare_at_price_min: number
  compare_at_price_max: number
  compare_at_price_varies: boolean
  variants: Variant[]
  images: string[]
  featured_image: string
  options: { name: string; position: number; values: string[] }[]
  media: Media[]
  requires_selling_plan: boolean
  selling_plan_groups: string[]
  content: string
}

export type Media = {
  alt: null | string
  id: number
  position: number
  preview_image: PreviewImage
  aspect_ratio: number
  height: number
  media_type: string
  src: string
  width: number
}

export type PreviewImage = {
  aspect_ratio: number
  height: number
  width: number
  src: string
}

export type Variant = {
  id: number
  title: string
  option1: string
  option2: string
  option3: string
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image: null | string
  available: boolean
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price: null | number
  inventory_management: null | string
  barcode: string
  requires_selling_plan: boolean
  selling_plan_allocations: string[]
}

export type Cart = {
  note: string
  attributes: Attributes
  original_total_price: number
  total_price: number
  total_discount: number
  total_weight: number
  item_count: number
  items: Item[]
  requires_shipping: boolean
  currency: string
  items_subtotal_price: number
  cart_level_discount_applications: unknown[]
  checkout_charge_amount: number
}

export type Attributes = object

export type Item = {
  id: number
  properties: Attributes
  quantity: number
  variant_id: number
  key: string
  title: string
  price: number
  original_price: number
  discounted_price: number
  line_price: number
  original_line_price: number
  total_discount: number
  discounts: unknown[]
  sku: string
  grams: number
  vendor: string
  taxable: boolean
  product_id: number
  product_has_only_default_variant: boolean
  gift_card: boolean
  final_price: number
  final_line_price: number
  url: string
  featured_image: FeaturedImage
  image: string
  handle: string
  requires_shipping: boolean
  product_type: string
  product_title: string
  product_description: string
  variant_title: string
  variant_options: string[]
  options_with_values: OptionsWithValue[]
  line_level_discount_allocations: unknown[]
  line_level_total_discount: number
}

export type FeaturedImage = {
  aspect_ratio: number
  alt: string
  height: number
  url: string
  width: number
}

export type OptionsWithValue = {
  name: string
  value: string
}
