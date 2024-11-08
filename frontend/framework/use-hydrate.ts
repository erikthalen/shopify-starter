import { Component } from './types'

/**
 * @function useHydrate
 * @description Used to initialize components, for when the window doesn't reload fully.
 */
export default (components: Component | Component[]) => {
  let teardownFunctions = null

  return {
    /**
     * @memberof useHydrate
     * @description Runs all the passed functions. Any arguments passed will be passed on to the components
     */
    hydrate(...args) {
      this.dehydrate()

      setTimeout(() => {
        teardownFunctions = []
          .concat(components)
          .map(component => {
            if (typeof component !== 'function') return

            return [].concat(component(...args))
          })
          .flat(10)
          .filter(Boolean)
      })

      return args.length > 1 ? [args] : args[0]
    },

    /**
     * @memberof useHydrate
     * @description Runs any/all the returned functions returned from the `hydrate`
     */
    dehydrate() {
      teardownFunctions?.map(async teardown => {
        const value = await Promise.resolve(teardown)

        if (Array.isArray(value)) {
          value.forEach(v => {
            if (typeof v === 'function') {
              v()
            }
          })
        }

        if (typeof value === 'function') {
          value()
        }
      })

      teardownFunctions = null
    },
  }
}
