let currentTransition = null

// run this anytime you want to set a specific transition to run on the next page shift
export const setTransition = name => {
  currentTransition = name
}

/**
 * transitions is an object where the key is the name to be used for triggering the transition,
 * and the value is any of the barba js hooks to run to perform the transition
 */
export default ({ transitions, globals }) => {
  const [defaultTransition] = Object.keys(transitions)

  const runCurrentHook = async (hook, data) => {
    const currentHooks = transitions[currentTransition]

    /**
     * no transition set, or the name doesn't exist.
     */
    if (!currentTransition || !currentHooks) {
      /**
       * run nothing if not even the default-transition exists..
       */
      if (!transitions[defaultTransition][hook]) {
        return Promise.resolve()
      }

      /**
       * run default-transition.
       */
      // if (data.trigger === 'back') {
      //   return transitions.defaultBack[hook](data)
      // } else {
      //   return transitions.default[hook](data)
      // }

      return transitions[defaultTransition][hook](data)
    }

    /**
     * a transition was set, but doesn't exist
     */
    if (typeof currentHooks[hook] !== 'function') {
      return Promise.resolve()
    }

    /**
     * a transition was set, and exists, run it
     */
    return currentHooks[hook](data)
  }

  const runGlobalHook = (hook, data) => {
    if (typeof globals[hook] === 'function') {
      return globals[hook](data)
    }
  }

  const ALL_BARBA_HOOKS = [
    'beforeOnce',
    'once',
    'afterOnce',
    'before',
    'beforeLeave',
    'leave',
    'afterLeave',
    'beforeEnter',
    'enter',
    'afterEnter',
    'after',
  ]

  return [
    {
      sync: true,
      name: 'main',
      ...ALL_BARBA_HOOKS.reduce((acc, hook) => {
        return {
          ...acc,
          [hook](data) {
            runCurrentHook(hook, data)
            runGlobalHook(hook, data)
          },
        }
      }, {}),
      async leave(data) {
        await runCurrentHook('leave', data)
        runGlobalHook('leave', data)
      },
      async enter(data) {
        // bug: chrome doesn't scroll to top if new page is prefetched and cached.
        if (
          typeof data.trigger !== 'string' &&
          data.trigger !== 'back' &&
          data.trigger !== 'forward'
        ) {
          window.scrollTo(0, 0)
        }

        await runCurrentHook('enter', data)
        runGlobalHook('enter', data)

        /**
         * cleanup any transition
         */
        setTransition(defaultTransition)
        data.next.container.removeAttribute('style')
      },
    },
  ]
}
