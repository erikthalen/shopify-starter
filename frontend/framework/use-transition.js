/**
 * @private
 * The key of the set of hooks that will run on next page shift
 */
let currentTransition = null

/**
 * @function
 * @description Run this anytime you want to set a specific transition to run on the next page shift
 * @param {string} name - The key of a set of hooks to run next page shift
 */
export const setTransition = name => {
  currentTransition = name
}

/**
 * @function useTransition
 * @param {object} options - Options object
 * @param {object} options.page - An object where each key is a set of any Barba hooks
 * @param {object} options.global - A set of any Barba hooks
 * @param {object} options.barbaOptions - Any overwriting Barba options
 */
export const useTransition = ({ page, global }) => {
  const _runCurrentHook = async (hook, data) => {
    const currentHooks = page[currentTransition]

    // no transition set, or the name doesn't exist
    if (!currentTransition || !currentHooks) {
      const [defaultTransition] = Object.keys(page)

      // run nothing if not even the default-transition exists..
      if (!page[defaultTransition][hook]) {
        return Promise.resolve()
      }

      // run default-transition
      return page[defaultTransition][hook](data)
    }

    // a transition was set, but doesn't exist
    if (typeof currentHooks[hook] !== 'function') {
      return Promise.resolve()
    }

    // a transition was set, and exists, run it
    return currentHooks[hook](data)
  }

  const _runGlobalHook = (hook, data) => {
    if (typeof global[hook] === 'function') {
      return global[hook](data)
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
