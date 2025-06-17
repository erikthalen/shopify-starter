/**
 * Calls the passed function if not called again within <delay> ms.  
 * The callback is called with an abortcontroller as second argument, good for aborting a fetch if a new fetch is called.
 * @example
 * const getData = debounce((url, { signal }) => {
 *   const response = await fetch(url, { signal })
 *   return response.json()
 * })
 * 
 * const data = await getData('/url') // <- aborted
 * const data2 = await getData('/url')
 */
export default function debounce<A = unknown, R = void>(
  fn: (arg?: A, obj?: { signal: AbortSignal }) => Promise<R>,
  delay: number = 200
): (arg?: A) => Promise<R> {
  let abortController: AbortController | null = null

  return arg =>
    new Promise((resolve, reject) => {
      abortController?.abort('debounced')
      abortController = new AbortController()

      const handleAbort = () => {
        clearTimeout(timeout)
        reject('debounced')
      }

      const timeout = setTimeout(async () => {
        try {
          if (!abortController) return

          abortController.signal?.removeEventListener('abort', handleAbort)
          resolve(await fn(arg, { signal: abortController.signal }))
        } catch (error) {
          console.log(error)
          handleAbort()
        }
      }, delay)

      abortController.signal?.addEventListener('abort', handleAbort)
    })
}
