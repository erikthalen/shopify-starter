/**
 * useHydrate
 *
 * used to run through and initialize components.
 * components needs to be a function, that when run hydrates it.
 * if any teardown is needed, that should be put in a function and returned by the component.
 *
 * @param {function[]} components - array of init functions
 */
export default function (components) {
  let teardownFunctions = null

  return {
    /**
     * runs though all init functions and saves their return value in an array
     * @param {any[]} args - any arguments that should be passed to the components
     */
    hydrate(...args) {
      // teardown any previously hydrated components
      this.dehydrate()

      setTimeout(() => {
        teardownFunctions = components
          .map(component => {
            if (typeof component !== 'function') {
              return
            }

            return [].concat(component(...args))
          })
          .flat(10)
          .filter(Boolean)
      })

      return this
    },

    /**
     * runs though previously saved return values
     */
    dehydrate() {
      teardownFunctions?.map(teardown => {
        Promise.resolve(teardown).then(value => {
          if (typeof value === 'function') {
            value()
          }
        })
      })
      teardownFunctions = null
    },
  }
}
