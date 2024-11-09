# Components

The theme's using [Barba.js](https://barba.js.org/) to navigate.

In order to keep the components on the site hydrated, there's a few framework-functions to handle this.

```ts
import { Component } from '~/types'

// ref is an object containing every dom element with a [data-ref]-attr (converted to camelCase)
// second argument is optional
// if the component returns Function of Function[], those are called on page shift
const component: Component = (ref, { signal = null } = {}) => {
  // if nothing to hydrate
  if (!ref.myRef) return

  const doSomething = e => console.log(e.target, 'was clicked')

  // every value on ref is HTMLElement[]
  return ref.myRef.map(element => {
    // signal is aborted on page shift
    element.addEventListener('click', doSomething, { signal })

    // optional
    return () => {
      console.log("that's it for this instance")
    }
  })

  // optional
  return () => {
    console.log("that's it for the component")
  }
}

// export something to index.ts
export default component
```

```ts
// a component can be as small as:
const smallComponent: Component = ref => {
  if (!ref.myElement) return

  console.log(ref.myElement)
}

// or even:
const smallerComponent: Component = ref => console.log(ref)

// or why not:
const smComp: Component = () => console.log('hllo wrld!')

// even:
const c: Component = console.log
```
