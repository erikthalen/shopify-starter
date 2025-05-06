import { AlpineComponent, Stores } from 'alpinejs'

/**
 * Used to define type safe Alpine components
 * @example:
 *
 * export default defineComponent(() => ({ myVar: boolean }))
 * export default defineStore({ myVar: boolean })
 */

export const defineComponent = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => AlpineComponent<T>
) => fn

export const defineStore = <T>(arg: Stores) => arg as T
