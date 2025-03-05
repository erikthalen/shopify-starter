import { defineStore } from '~/utils/define'

export default defineStore({
  amount: null as number | null,

  setAmount(amount: number) {
    this.amount = amount
  },
})
