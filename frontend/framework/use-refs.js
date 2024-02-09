/**
 * 
 * @param {HTMLElement} [target=document.body] - Element to querySelect in
 * @param {string} [exclude] - Selector or element who's children wont be selected
 * @param {boolean | function} [watch] - Watches DOM and updates refs on mutation
 * @param {boolean} [asArray] - Saves all refs in arrays, also single elements
 * @returns {Object} { myRef: div, another: [button, span] }
 */
export default ({ target = document.body, exclude, watch, asArray } = {}) => {
  const root =
    typeof target === 'string'
      ? document.querySelector(`[data-namespace="${target}"]`)
      : target
  const name = root?.getAttribute('data-namespace')

  return watch
    ? _watched(root, name, watch, asArray, exclude)
    : _refs(root, name, true, asArray, exclude)
}

function _refs(root, name, includeRoot, asArray, exclude) {
  const camelCase = s => s.replace(/-./g, x => x[1].toUpperCase())
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
  const attribute = name ? `data-ref-${name}` : 'data-ref'

  return [...root.querySelectorAll(`[${attribute}]`)].reduce((refs, el) => {
    if (el.closest(exclude))
      return {
        ...(includeRoot && { root }),
        ...refs,
      }

    const dataset = name ? 'ref' + capitalize(camelCase(name)) : 'ref'
    return {
      ...(includeRoot && { root }),
      ...refs,
      ...(camelCase(el.dataset[dataset]) || 'item').split(' ').reduce(
        (acc, newRef) => ({
          ...acc,
          [newRef]: refs[newRef]
            ? [refs[newRef], el].flat()
            : asArray
            ? [el]
            : el,
        }),
        {}
      ),
    }
  }, {})
}

function _watched(r, n, onChange, asArray, exclude) {
  const observer = new MutationObserver(() => {
    ref.current = _refs(r, n)
    typeof onChange === 'function' && onChange()
  })
  observer.observe(r, { childList: true, subtree: true })

  const ref = {
    root: r,
    current: _refs(r, n, true, asArray),
    unwatch: observer.disconnect.bind(observer),
  }

  return ref
}
