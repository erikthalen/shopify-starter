/**
 * calls the passed function if not called again within [delay] ms.
 * an abortcontroller is passed to the callback, good for aborting a fetch if a new fetch is called
 */
export default function debounce<T>(
  callback: (arg: unknown, obj: { signal: AbortSignal }) => Promise<T>,
  delay: number = 200
  // eslint-disable-next-line
): (arg: unknown) => Promise<T | Error> {
  let abortController = null

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
          abortController.signal?.removeEventListener('abort', handleAbort)
          resolve(await callback(arg, { signal: abortController.signal }))
        } catch (error) {
          console.log(error)
          handleAbort()
        }
      }, delay)

      abortController.signal?.addEventListener('abort', handleAbort)
    })
}
