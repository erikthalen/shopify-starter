/**
 * Creates a debounced version of an asynchronous function that delays invoking the function
 * until after a specified delay time has elapsed since the last time it was invoked.
 * If the returned function is called again before the delay ends, the previous invocation is aborted.
 *
 * @template A - The argument type of the debounced function.
 * @template R - The return type of the original asynchronous function.
 *
 * @param {(arg?: A, obj?: { signal: AbortSignal }) => Promise<R>} fn -
 *   The asynchronous function to debounce. It receives an optional argument and an AbortSignal.
 * @param {Object} options - Debounce configuration options.
 * @param {number} [options.delay=200] - The debounce delay in milliseconds.
 * @param {boolean} [options.silent=false] - If `true`, aborted promises will not be rejected.
 *
 * @returns {(arg?: A) => Promise<R>} - A debounced version of the provided function.
 *
 * @example
 * // Example usage with a search API
 * const search = async (query, { signal }) => {
 *   const response = await fetch(`/api/search?q=${query}`, { signal });
 *   return response.json();
 * };
 *
 * const debouncedSearch = debounce(search, { delay: 300 });
 *
 * debouncedSearch("apple").then(result => {
 *   console.log(result);
 * }).catch(err => {
 *   if (err === "debounced") {
 *     console.log("Search request was debounced");
 *   } else {
 *     console.error("Search failed", err);
 *   }
 * });
 *
 * // If debouncedSearch is called again within 300ms, the previous call will be aborted.
 */
export default function debounce<A = unknown, R = void>(
  fn: (arg?: A, obj?: { signal: AbortSignal }) => Promise<R>,
  { delay = 200, silent = false }
): (arg?: A) => Promise<R> {
  let abortController: AbortController | null = null

  return arg =>
    new Promise((resolve, reject) => {
      abortController?.abort("debounced")
      abortController = new AbortController()

      const handleAbort = () => {
        clearTimeout(timeout)
        if (!silent) {
          reject("debounced")
        }
      }

      const timeout = setTimeout(async () => {
        try {
          if (!abortController) return

          abortController.signal?.removeEventListener("abort", handleAbort)
          resolve(await fn(arg, { signal: abortController.signal }))
        } catch (error) {
          console.log(error)
          handleAbort()
        }
      }, delay)

      abortController.signal?.addEventListener("abort", handleAbort)
    })
}
