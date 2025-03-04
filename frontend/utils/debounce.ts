/**
 * calls the passed function if not called again within [delay] ms.
 * an abortcontroller is passed to the callback, good for aborting a fetch if a new fetch is called
 */

export default function debounce<A = unknown, R = void>(
  callback: (arg: A, obj: { signal: AbortSignal }) => Promise<R>,
  delay: number = 200
): (arg: A) => Promise<R> {
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
          resolve(await callback(arg, { signal: abortController.signal }))
        } catch (error) {
          console.log(error)
          handleAbort()
        }
      }, delay)

      abortController.signal?.addEventListener('abort', handleAbort)
    })
}
