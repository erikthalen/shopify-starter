/**
 * @function useHydrate
 * @description Used to initialize components, for when the window doesn't reload fully.
 * @param {function[]} - Array of function run loop through
 * @returns {useHydrate~hydrate} - the returned function
 * @returns {useHydrate~dehydrate} - the returned function again
 */
export default components => {
  let teardownFunctions = null

  return {
    /**
     * @memberof useHydrate
     * @description Runs all the passed functions. Any arguments passed will be passed on to the components
     * @param {*} ...args - n arguments that should be passed to the components
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
     * @description Runs any/all the returned functions returned from the `hydrate`
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
