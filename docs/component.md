# Components

The theme's using [Barba.js](https://barba.js.org/) to navigate.

In order to keep the components on the site hydrated, there's a few framework-functions to handle this.

Each component should be a function following the type of Component. Each function has access to 2 arguments. The first is the result of `useRefs()`, and the other is an object containing an AbortSignal that is used to remove event listeners.

## Examples

### Standard

```liquid
<button data-ref='my-button'>My button</button>
```

```ts
// /frontend/components/my-component.ts
import { Component } from '~/types'

const component: Component = (ref, { signal = null } = {}) => {
  // if nothing to hydrate
  if (!ref.myButton) return

  const doSomething = e => console.log(e.target, 'was clicked')

  ref.myButton.map(button => {
    button.addEventListener('click', doSomething, { signal })
  })
}

export default component
```

### Cleanup

If the component returns a function, or an array of functions, this will be called on page shift. Good when the component need to do something after it's unmounted.

```ts
// /frontend/components/my-component.ts
import { Component } from '~/types'

const component: Component = ref => {
  if (!ref.myElement) return

  const doSomething = () => console.log(e.target, 'was clicked')

  return ref.myElement.map(element => {
    const interval = setInterval(doSomething, 1000)

    return () => {
      clearInterval(interval)
    }
  })
}

export default component
```

```ts
// /frontend/components/my-component.ts
import { Component } from '~/types'

const component: Component = ref => {
  if (!ref.myElement) return

  const doSomething = () => console.log(e.target, 'was clicked')

  const interval = setInterval(doSomething, 1000)

  return () => clearInterval(interval)
}

export default component
```

### Flexibility

A component can be as small as:

```ts
const smallComponent: Component = ref => {
  if (!ref.myElement) return

  console.log(ref.myElement)
}
```

or even:

```ts
const smallerComponent: Component = ref => console.log(ref)
```

or why not:

```ts
const smComp: Component = () => console.log('hllo wrld!')
```

even:

```ts
const c: Component = console.log
```
