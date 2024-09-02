export function debounce(callback, delay) {
  let abortController = null

  return arg =>
    new Promise((resolve, reject) => {
      // abort any previous call to debounce
      abortController?.abort('debounced')
      abortController = new AbortController()

      const handleAbort = () => {
        clearTimeout(timeout)
        reject('debounced')
      }

      let timeout = setTimeout(async () => {
        try {
          // no new calls to debounce was made,
          // cleanup the current abort controller
          abortController.signal?.removeEventListener('abort', handleAbort)
          // run the callback!
          resolve(await callback(arg, { signal: abortController.signal }))
        } catch (error) {
          handleAbort()
        }
      }, delay)

      // cancel pending callback, and reject the previous promise
      abortController.signal?.addEventListener('abort', handleAbort)
    })
}
