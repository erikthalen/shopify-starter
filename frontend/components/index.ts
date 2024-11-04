import { Component } from '~/framework/types'
import { cart } from './cart'
import { cartAmount } from './cart-amount'
import { productForm } from './product-form'

// add all components that only needs to be initialized once
export const globals: Component[] = [
  cartAmount,
  () => console.log('%cGlobal Component 1 hydrated', 'color: orange'),
]

// add all components that needs to be initialized after every page shift
export const components: Component[] = [
  cart,
  productForm,
  () => {
    console.log('%cComponent 1 hydrated', 'color: green')
    return () => console.log('%cComponent 1 de-hydrated', 'color: green')
  },
]
