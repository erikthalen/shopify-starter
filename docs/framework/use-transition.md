# useTransition

Used as a transition router, to control which transition to run next.

> [!TIP]
> If you choose to handle navigation with something other than barba.js, this function can be omitted and removed. As it's built to extend the barba-api.

Trigger and run specific transitions not tied to specific routes (as is Barba default behavior). Should be passed to a Barba instance like:

```ts
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
```

### Runtime usage

Somewhere in your app, when you want some other than default-transition to run. Preferably triggered by an click event of a link

```ts
myLink.addEventListener('click', () => {
  // logs 'leaving' and 'entering' next time a navigation happens
  setTransition('myOtherTransition')
})
```

If no transition is set before a page shift happens, the first one in `{ page }` will be used. So any "default" page transition must be put as the first key in the object, when running `useTransition`.
