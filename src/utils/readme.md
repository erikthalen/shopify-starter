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
