// add all components that only needs to be initialized once
export const globals = [
  (ref) => console.log('Global Component 1 hydrated'),
]

// add all components that needs to be initialized after every page shift
export const components = [
  (ref) => console.log('Component 1 hydrated'),
  (ref) => {
    console.log('Component 2 hydrated, with refs: ', ref)
    return () => console.log('Component 2 dehydrated')
  },
]