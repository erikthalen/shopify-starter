import type { AlpineComponent } from 'alpinejs'

type CartAmountComponent = {
  amount: number | null
  setAmount: (amount: number) => void
}

const cartAmount: AlpineComponent<CartAmountComponent> = {
  amount: null,

  setAmount(amount) {
    this.amount = amount
  },
}

export default cartAmount
