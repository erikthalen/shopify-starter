type RefTypes = {
  root?: HTMLElement
  namespaced?: boolean
  watch?: boolean
  asArray?: boolean
  exclude?: HTMLElement | null
}

/**
 * @function useRefs
 * @description Collect all dom elements with the attribute [data-ref]
 * @param {object} [options] - Options object
 * @param {HTMLElement} [options.root=document.body] - Element to querySelect in
 * @param {boolean} [options.namespaced] - Only get children with data-ref-parent-ref
 * @param {HTMLElement} [options.exclude] - Element and elements children wont be selected
 * @param {boolean | function} [options.watch] - Watches DOM and updates refs on mutation
 * @param {boolean} [options.asArray] - Saves all refs in arrays, also single elements
 * @return {Object} { myRef: div, another: [button, span] }
 */
export default ({
  root = document.body,
  namespaced = false,
  watch = false,
  asArray = true,
  exclude = null,
}: RefTypes = {}) => {
  if (!(root instanceof HTMLElement)) {
    console.warn('{ root } has to be an element')
    return
  }

  return {
    root,
    ...(watch
      ? _watched(root, watch, exclude, asArray, namespaced)
      : _refs({ root, exclude, asArray, namespaced })),
  }
}

function _refs({ root, exclude, asArray, namespaced }: RefTypes) {
  const camelCase = s => (s ? s.replace(/-./g, x => x[1].toUpperCase()) : '')
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

  const attribute = namespaced ? `data-ref-${root.dataset.ref}` : 'data-ref'
  const elements: NodeListOf<HTMLElement> = root.querySelectorAll(
    `[${attribute}]`
  )

  const refs = new Map<string, HTMLElement | HTMLElement[]>()

  /**
   * loop over all element with [data-ref]
   */
  elements.forEach(element => {
    /**
     * discard if element is part of an excluded dom branch
     */
    if (exclude && (exclude === element || exclude.contains(element))) return

    const namespace: string = namespaced
      ? capitalize(camelCase(root.dataset.ref))
      : ''

    /**
     * extract the value of the [data-ref] attribute, default to "item"
     */
    const keys: string = camelCase(element.dataset['ref' + namespace]) || 'item'

    /**
     * split on space, allowing for multiple ref values (saves element under multiple keys)
     */
    keys.split(' ').forEach(key => {
      if (refs.has(key)) {
        /**
         * push element to existing array of elements with same [data-ref]
         */
        refs.set(key, [refs.get(key), element].flat())
      } else {
        /**
         * create new key with this element as value
         */
        refs.set(key, asArray ? [element] : element)
      }
    })
  })

  return Object.fromEntries(refs)
}

function _watched(root, onChange, ...args) {
  const ref = { current: _refs({ root, ...args }) }

  const observer = new MutationObserver(() => {
    ref.current = _refs({ root, ...args })

    if (typeof onChange === 'function') {
      onChange(ref.current)
    }
  })

  observer.observe(root, { childList: true, subtree: true })

  return { ref, unwatch: observer.disconnect.bind(observer) }
}
