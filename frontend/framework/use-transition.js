/** @module useTransition */

/**
 * @private
 * The key of the set of hooks that will run on next page shift
 */
let currentTransition = null

/**
 * @global
 * @description Run this anytime you want to set a specific transition to run on the next page shift
 * @param {string} - The key of a set of hooks to run next page shift
 */
export const setTransition = name => {
  currentTransition = name
}

/**
 * @function
 * @description transitions is an object where the key is the name to be used for triggering the transition, and the value is any of the barba js hooks to run to perform the transition
 * @param options
 * @param {object} options.transitions - An object where each key is a set of any Barba hooks
 * @param {object} options.globals - A set of any Barba hooks
 * @param {object} options.barbaOptions - Any overwriting Barba options
 */
export default ({ transitions, globals }) => {
  const _runCurrentHook = async (hook, data) => {
    const currentHooks = transitions[currentTransition]

    // no transition set, or the name doesn't exist
    if (!currentTransition || !currentHooks) {
      const [defaultTransition] = Object.keys(transitions)

      // run nothing if not even the default-transition exists..
      if (!transitions[defaultTransition][hook]) {
        return Promise.resolve()
      }

      // run default-transition
      return transitions[defaultTransition][hook](data)
    }

    // a transition was set, but doesn't exist
    if (typeof currentHooks[hook] !== 'function') {
      return Promise.resolve()
    }

    // a transition was set, and exists, run it
    return currentHooks[hook](data)
  }

  const _runGlobalHook = (hook, data) => {
    if (typeof globals[hook] === 'function') {
      return globals[hook](data)
    }
  }

  // bug: chrome doesn't scroll to top if new page is prefetched and cached.
  function maybeScrollBackToTop(trigger) {
    if (
      typeof trigger !== 'string' &&
      trigger !== 'back' &&
      trigger !== 'forward'
    ) {
      window.scrollTo(0, 0)
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
          async [hook](data) {
            await _runCurrentHook(hook, data)
            _runGlobalHook(hook, data)
          },
        }
      }, {}),
      async leave(data) {
        await _runCurrentHook('leave', data)
        _runGlobalHook('leave', data)
      },
      async enter(data) {
        maybeScrollBackToTop(data.trigger)

        await _runCurrentHook('enter', data)
        _runGlobalHook('enter', data)

        // cleanup
        setTransition(null)
        data.next.container.removeAttribute('style')
      },
    },
  ]
}
