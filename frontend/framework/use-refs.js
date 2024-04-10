/**
 * 
 * @param {HTMLElement} [target=document.body] - Element to querySelect in
 * @param {boolean} [namespaced] - Only get children with data-ref-parent-ref
 * @param {string} [exclude] - Selector or element who's children wont be selected
 * @param {boolean | function} [watch] - Watches DOM and updates refs on mutation
 * @param {boolean} [asArray] - Saves all refs in arrays, also single elements
 * @returns {Object} { myRef: div, another: [button, span] }
 */
export default ({
  root = document.body,
  namespaced = false,
  watch = false,
  asArray = false,
  exclude = null,
}: any = {}) => {
  if (!(root instanceof HTMLElement)) {
    console.warn('{ root } has to be an element')
    return
  }

  return {
    root,
    ...(watch
      ? _watched(root, watch, exclude, asArray, namespaced)
      : _refs(root, exclude, asArray, namespaced))
  }
}

function _refs(root: HTMLElement, exclude = null, asArray = false, namespaced = false) {
  const camelCase = (s: string | undefined) => s ? s.replace(/-./g, x => x[1].toUpperCase()) : ''
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const attribute = namespaced ? `data-ref-${root.dataset.ref}` : 'data-ref'
  const elements = root.querySelectorAll(`[${attribute}]`)

  const refs = new Map()

  elements.forEach(element => {
    if (exclude && element.closest(exclude)) return

    const dataset = 'ref' + (namespaced ? capitalize(camelCase(root.dataset.ref)) : '')
    const keys = (camelCase((element as HTMLElement).dataset[dataset]) || 'item').split(' ')

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

function _watched(root: HTMLElement, onChange: ((args?: any) => any) | boolean, ...args: any[]) {
  const ref = { current: _refs(root, ...args) }

  const observer = new MutationObserver(() => {
    ref.current = _refs(root, ...args)
    typeof onChange === 'function' && onChange(ref.current)
  })

  observer.observe(root, { childList: true, subtree: true })

  return { ref, unwatch: observer.disconnect.bind(observer) }
}
