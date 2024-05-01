/** @module useEvents */

// current registered eventlistener signals
let _signals = []

export default {
  /**
   * @function
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
   * @param {HTMLElement} [target] - target to emit from, defaults to `window`
   */
  dispatch: (name, data, target = window) => {
    const event = new CustomEvent(name, { detail: data })
    target.dispatchEvent(event)
  },

  /**
   * removes all, non global, events
   */
  dehydrate() {
    _signals.forEach(signal => {
      if (signal && typeof signal.abort === 'function') {
        signal.abort()
      }
    })
    _signals = []
  },
}

function _makeSignal() {
  const abortController = new AbortController()
  const signal = abortController.signal

  _signals.push(abortController)

  return signal
}
