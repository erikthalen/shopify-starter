// add all components that only needs to be initialized once
export const globals = [
  (await import('~/components/foo')).default
]

// add all components that needs to be initialized after every page shift
export const components = [
  (await import('~/components/foobar')).default
]