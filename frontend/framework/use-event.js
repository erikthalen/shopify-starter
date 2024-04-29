/**
 * useEvents
 * 
 * used for sending events between components.
 * listeners are stored globally, and therefore possible to remove on dehydration.
 * 
 */

let signals = []

export default {
  /**
   * 
   * @param {string} name - name of the event to listen to
   * @param {function} cb - callback to run
   * @param {object} [options] - { global: true } never remove listener
   */
  listen: (name, cb, { global } = {}) => {
    const ops = global ? {} : { signal: _makeSignal() }
    window.addEventListener(name, cb, ops)
  },

  /**
   * 
   * @param {string} name - name of event to dispatch
   * @param {*} data - payload to emit
   * @param {HTMLElement} [target] - target to emit from, defaults to window
   */
  dispatch: (name, data, target = window) => {
    const event = new CustomEvent(name, { detail: data })
    target.dispatchEvent(event)
  },

  /**
   * removes all, non global, events
   */
  dehydrate() {
    signals.forEach(signal => {
      if (signal && typeof signal.abort === 'function') {
        signal.abort()
      }
    })
    signals = []
  },
}

function _makeSignal() {
  const abortController = new AbortController()
  const signal = abortController.signal

  signals.push(abortController)

  return signal
}
