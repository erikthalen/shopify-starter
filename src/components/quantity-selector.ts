import { defineComponent } from "~/utils/define"

/**
 * component that creates a quantity input.
 * reacts to "decrease" and "increase" functions.
 * outputs current value into any child-`<input>` and -`<output>`
 *
 * @example
 * <div x-data="quantitySelector({ value: 4, min: 1 })">
 *   <button x-on:click="decrease">Decrease</button>
 *   <button x-on:click="increase">Increase</button>
 *   <input type="hidden" value="4">
 *   <output>4</output>
 * </div>
 */
export default defineComponent(
  ({ min = 0, init = 1 }: { min: number; init: number }) => ({
    value: init,

    init() {
      this.render()
    },

    increase() {
      this.value++
      this.render()
    },

    decrease() {
      this.value = Math.max(min, this.value - 1)
      this.render()
    },

    render() {
      const input = this.$root.querySelector("input")
      const output = this.$root.querySelector("output")

      if (input) input.value = this.value.toString()
      if (output) output.value = this.value.toString()
    },
  })
)
