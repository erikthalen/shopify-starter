import { defineComponent } from '~/utils/define'

export default defineComponent(() => ({
  loading: false,
  isOpen: false,

  open() {
    setTimeout(() => (this.isOpen = true))
  },

  close() {
    this.isOpen = false
  },
}))
