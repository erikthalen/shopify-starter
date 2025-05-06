import { defineComponent } from '~/utils/define'

export default defineComponent(() => ({
  loading: false,
  isOpen: false,

  // async render() {
  //   const response = await fetch('?section_id=cart-drawer')
  //   const text = await response.text()
  //   const content = new DOMParser()
  //     .parseFromString(text, 'text/html')
  //     .querySelector('[data-cart]')

  //   const cart = this.$root.querySelector('[data-cart]')

  //   if (content?.innerHTML && cart) {
  //     cart.innerHTML = content?.innerHTML
  //   }
  // },

  open() {
    setTimeout(() => (this.isOpen = true))
  },

  close() {
    this.isOpen = false
  },
}))
