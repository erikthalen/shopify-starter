import { defineComponent } from "~/utils/define"

/**
 * component that creates a quantity input.
 * reacts to "decrease" and "increase" functions.
 * outputs current value into any child <input> and <output>
 *
 * @example
 * <div x-data="quantitySelector({ value: 4, min: 1 })">
 *  <button @click="decrease">Decrease</button>
 *  <button @click="increase">Increase</button>
 *  <input type="hidden" value="4">
 *  <output>4</output>
 * </div>
 */
export default defineComponent(
  ({ min = 0, init = 1 }: { min: number; init: number }) => ({
    value: init,

    init() {
      this.update()
    },

    increase() {
      this.value++

      this.update()
    },

    decrease() {
      this.value = Math.max(min, this.value - 1)

      this.update()
    },

    update() {
      const input = this.$root.querySelector("input")
      const output = this.$root.querySelector("output")

      if (input) {
        input.value = this.value.toString()
      }

      if (output) {
        output.value = this.value.toString()
      }
    },
  })
)
