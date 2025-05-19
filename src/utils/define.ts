import { AlpineComponent } from "alpinejs"

/**
 * Used to define type safe Alpine components.
 * Adds the built in Alpine $magics to each component's types.
 * @example
 * export default defineComponent(() => ({
 *   init() {
 *     console.log(this.$root) // <- no ts-error
 *   }
 * }))
 */
export const defineComponent = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => AlpineComponent<T>
) => fn
