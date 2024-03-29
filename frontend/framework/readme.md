# `/framework`

## `dev-grid`

Append `?grid` to the url to see a grid. Setup the grid according to the project in `/frontend/framework/dev-grid.css`

## `useEvent`

Used to send [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) between components, has three methods:

`listen`: Start listening to an event  
`dispatch`: Send event to all listeners  
`dehydrate`: Remove all (non-global) events. Run this on page navigation

```js
const callback = ({ detail }) => console.log('hello: ', detail)

useEvent.listen('event-name', callback) // 'hello: world!'

useEvent.dispatch('event-name', 'world!')

// on navigation
useEvent.dehydrate()
```

Global events are created by:

```js
useEvent.listen('event-name', callback, { global: true })
```

## `useHydrate`

Used to initialize components, for when the window doesn't reload fully. When making a component for `useHydrate` two things must be followed:

- The component must be a function (which is what runs to do the hydration)
- Any cleanup the component might need, must be inside a function returned by the first function

```js
// my-component.js
export default () => {
  // do stuff

  // (optionally)
  return () => {
    // cleanup stuff
  }
}
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

## `useRefs`

Saves all dom elements with a `data-ref` attribute to an object. Has some more functionality, documented in its file.

```html
<div data-ref="my-element"></div>
```

```javascript
const ref = useRefs()
console.log(ref.myElement) // <div>
```

## `useTransition`

Used to trigger and run specific transitions not tied to specific routes (as is Barba default behavior). Should be passed to a Barba instance like:

```javascript
barba.init({
  transitions: useTransition({
    transitions: {
      myTransition: {
        // any barba hooks
        enter() {}
      }
      myOtherTransition: {
        leave() {
          console.log('leaving')
        },
        enter() {
          console.log('entering')
        }
      }
    },
    globals: {
      // any barba hooks
      leave() {},
      enter() {},
    },
  }),
})

// one time in your app
setDefaultTransition('myTransition')

// somewhere in your app, when you want some other than default-transition to run
setTransition('myOtherTransition') // -> logs 'leaving' and 'entering' next time a navigation happens
```

- `globals`: Runs on every page shift, no matter the transition.
- `transitions`: Objects containing { name: { hooks } } for your transitions
