/**
 * @function useHydrate
 * @param {function[]} - Array of function run loop through
 * @return {useHydrate~hydrate} - the returned function
 * @return {useHydrate~dehydrate} - the returned function again
 */
export function useHydrate(components) {
  let teardownFunctions = null

  return {
    /**
     * @memberof useHydrate
     * @param {*} ...args - n arguments that should be passed to the components
     * @description runs though all init functions and saves their return value in an array
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
     * @memberof useHydrate
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
