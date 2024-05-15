import { useRefs } from './../framework'

// add all components that only needs to be initialized once
export const globals = [
  () => console.log('Global Component 1 hydrated'),
]

// add all components that needs to be initialized after every page shift
export const components = [
  () => console.log('Component 1 hydrated'),
  (ref) => {
    console.log('Component 2 hydrated, with refs: ', ref)
    return () => console.log('Component 2 dehydrated')
  },
  ref => {
    if (!ref.testSection) return

    ref.testSection.forEach(item => {
      const refs = useRefs({ root: item, namespaced: true })
      console.log(refs)
      
      refs.button.addEventListener('click', () => {
        history.pushState({}, null, location.href + 'hejjja')
      })
    })
  }
]