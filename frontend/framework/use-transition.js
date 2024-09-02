function createResolver() {
  let resolver = null
  const promise = new Promise(resolve => (resolver = resolve))

  return { promise, resolver }
}

const { promise, resolver } = createResolver()

/**
 * @private
 * The key of the set of hooks that will run on next page shift
 */
let currentTransition = null

export const pageTransition = {
  finished: promise,
  resolver: resolver,
  done() {
    if (typeof this.resolver === 'function') {
      this.resolver()
    }

    const { promise, resolver } = createResolver()

    this.finished = promise
    this.resolver = resolver
  },
}

/**
 * @function useTransition
 * @description Used to trigger and run specific transitions not tied to specific routes (as is Barba default behavior).
 * @param {object} options - Options object
 * @param {object} options.page - An object where each key is a set of any Barba hooks
 * @param {object} options.global - A set of any Barba hooks
 * @param {object} options.barbaOptions - Any overwriting Barba options
 */
export default ({ page, global }) => {
  const _runCurrentHook = async (hook, data) => {
    const currentHooks = page[currentTransition]

    // no transition set, or the name doesn't exist
    if (!currentTransition || !currentHooks) {
      const [defaultTransition] = Object.keys(page)

      // run nothing if the default transition has current hook registered
      if (!page[defaultTransition][hook]) {
        return Promise.resolve()
      }

      // run defaultTransition's hook
      return page[defaultTransition][hook](data)
    }

    // a currentTransition doesn't have currentHook registered
    if (typeof currentHooks[hook] !== 'function') {
      return Promise.resolve()
    }

    // currentTransition has currentHook registered, run it
    return currentHooks[hook](data)
  }

  const _runGlobalHook = (hook, data) => {
    if (typeof global[hook] !== 'function') return

    return global[hook](data)
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
            _runGlobalHook(hook, data)
            await _runCurrentHook(hook, data)
          },
        }
      }, {}),
      async once(data) {
        _runGlobalHook('once', data)
      },
      async leave(data) {
        _runGlobalHook('leave', data)
        await _runCurrentHook('leave', data)
      },
      async enter(data) {
        maybeScrollBackToTop(data.trigger)

        _runGlobalHook('enter', data)
        await _runCurrentHook('enter', data)

        // cleanup
        setTransition(null)
        data.next.container.removeAttribute('style')
        pageTransition.done()
      },
    },
  ]
}

/**
 * @function
 * @description Run this anytime you want to set a specific transition to run on the next page shift
 * @param {string} name - The key of a set of hooks to run next page shift
 */
export const setTransition = name => {
  currentTransition = name
}
