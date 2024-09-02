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
  namespaced,
  watch,
  asArray,
  exclude,
} = {}) => {
  if (!(root instanceof HTMLElement)) {
    console.warn('{ root } has to be an element')
    return
  }

  return {
    root,
    ...(watch
      ? _watched(root, watch, exclude, asArray, namespaced)
      : _refs(root, exclude, asArray, namespaced)),
  }
}

function _refs(root, exclude = null, asArray = false, namespaced = false) {
  const camelCase = s => (s ? s.replace(/-./g, x => x[1].toUpperCase()) : '')
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

  const attribute = namespaced ? `data-ref-${root.dataset.ref}` : 'data-ref'
  const elements = root.querySelectorAll(`[${attribute}]`)

  const refs = new Map()

  elements.forEach(element => {
    if (exclude && (exclude === element || exclude.contains(element))) return

    const dataset =
      'ref' + (namespaced ? capitalize(camelCase(root.dataset.ref)) : '')
    const keys = (camelCase(element.dataset[dataset]) || 'item').split(' ')

    keys.forEach(key => {
      if (refs.has(key)) {
        refs.set(key, [refs.get(key), element].flat())
      } else {
        refs.set(key, asArray ? [element] : element)
      }
    })
  })

  return Object.fromEntries(refs)
}

function _watched(root, onChange, ...args) {
  const ref = { current: _refs(root, ...args) }

  const observer = new MutationObserver(() => {
    ref.current = _refs(root, ...args)
    typeof onChange === 'function' && onChange(ref.current)
  })

  observer.observe(root, { childList: true, subtree: true })

  return { ref, unwatch: observer.disconnect.bind(observer) }
}
