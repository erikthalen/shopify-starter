# `/framework`

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
    page: {
      myTransition: {
        // any barba hooks
        enter() {
          console.log('i will run if nothing else is set with setTransition')
        }
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
    global: {
      // any barba hooks
      leave() {
        console.log('i will run on every page shift, no matter what transition is active')
      },
      enter() {},
    },
  }),
})

// somewhere in your app, when you want some other than default-transition to run
// preferably triggered by an click event of a link
setTransition('myOtherTransition') // -> logs 'leaving' and 'entering' next time a navigation happens
```

If no transition is set before a page shift happens, the first one in { page } will be used. So any "default" page transition must be put as the first key in the object, when running useTransition.

- `page`: Objects containing { transitionName: { ...hooks } } for your transitions
- `global`: Runs on every page shift, no matter the transition.

## Utils

### `createDevGrid`

Append `?grid` to the url to see a grid.

### `fixatePageOnNavigation`

Makes so that the native browser scroll persisting be used