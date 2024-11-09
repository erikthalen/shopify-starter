# useHydrate

Used to initialize components, for when the window doesn't reload fully. When making a component for `useHydrate` two things must be followed:

- The component must be a function (which is what runs to do the hydration)
- Any cleanup the component might need, must be inside a function returned by the first function

```ts [./frontend/components/my-component.ts]
import { Component } from '~/types'

const component: Component () => {
  // do stuff

  // (optionally)
  return () => {
    // cleanup stuff
  }
}

export default component
```

```ts
import component from './components.ts'

const hydrator = useHydrate(component)

hydrator.hydrate()
```

Create a useHydrate instance by running the `useHydrate(components: Function[])` with an array of functions (components). This returns two methods:

`hydrate`: Runs all the passed functions. Any arguments passed will be passed on to the components  
`dehydrate`: Runs any/all the returned functions returned from the `hydrate`

```js
const component = arg => console.log('component: ', arg)

// on page load
const hydration = useHydrate([component]).hydrate('first') // 'component: "first"'

// on navigation
hydration.dehydrate()

// after navigation
hydration.hydrate('second') // 'component: "second"'
```
