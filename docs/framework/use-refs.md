# useRefs

Saves all dom elements with a `data-ref` attribute to an object. Has some more functionality, documented in its file.

```html [index.html]
<div data-ref="my-element"></div>
```

```ts [main.ts]
const ref = useRefs()
console.log(ref.myElement) // <div>
```

### Options

#### root

- **Type:** `HTMLElement`
- **Default:** `document.body`

What element to querySelect in

#### namespaced

- **Type:** `Boolean`
- **Default:** `false`

Saves only children with [data-ref-namespace]

#### watch

- **Type:** `Boolean`
- **Default:** `false`

Update refs when the dom changes

#### asArray

- **Type:** `Boolean`
- **Default:** `true`

Always save elements in arrays

#### exclude

- **Type:** `HTMLElement | null`
- **Default:** `null`

Element who's chidren wont be saved

### Examples

Defaults to finding all elements with a `[data-ref]` in `<body>`,
saving these as camelCased keys on an object:

```html
<body>
  <code data-ref="the-element">🐶</code>
</body>
````

```ts
const ref = getRefs()

console.log(ref.theElement) // -> <code>
```

Multiple `[data-ref]` with same value are stored in an array:

```html
<body>
  <code data-ref="foo-bar">🐶</code>
  <pre data-ref="foo-bar">🐱</pre>
</body>
```

```ts
const ref = getRefs()

console.log(ref.fooBar) // -> [<code>, <pre>]
```

Pass an element to scope the querySelector:

```html
<body>
  <main>
    <code data-ref="i-am-found">🐶</code>
  </main>

  <pre data-ref="discard-me">🐱</pre>
</body>
```

```ts
const ref = getRefs({ root: document.querySelector('main') })

console.log(ref.iAmFound) // -> <code>
console.log(ref.discardMe) // -> undefined
```

Enable namespace, and only element with the same namespace as root are found:

```html
<body data-ref="my-app">
  <code data-ref-my-app="i-am-found">🐶</code>
  <pre data-ref="discard-me">🐱</pre>
</body>
```

```ts
const ref = getRefs({ namespace: true })

console.log(ref.iAmFound) // -> <code>
console.log(ref.discardMe) // -> undefined
```

To save an element under multiple keys,
add multiple values separated with a space:

```html
<body>
  <code data-ref="first second third">🐶</code>
</body>
```

```ts
const ref = getRefs()

console.log((ref.first === ref.second) === ref.third) // -> true
```

`[data-ref]` with no value are stored under `{ item }`

```html
<body>
  <code data-ref>🐶</code>
</body>
```

```ts
const ref = getRefs()

console.log(ref.item) // -> <code>
```

The root element is stored under `{ root }`:

```html
<body>
  <div data-ref="foo"></div>
</body>
```

```ts
const ref = getRefs()

console.log(ref) // -> { root: <body>, foo: <div> }
```

If watch is `true`, the root will be watched for new elements.
Refs are accessed under `{ current }`, when `watch` is enabled.

```html
<body></body>
```

```ts
const ref = getRefs({ watch: true })

document.body.innerHTML = '<button data-ref="new-element">🥸</button>'

// wait for element to be inserted in the DOM
setTimeout(() => {
  console.log(ref.current.newElement) // -> <button>
})
```

Watching can be cancelled by calling `unwatch`

```ts
const ref = getRefs({ watch: true })

ref.unwatch()

document.body.innerHTML = '<button data-ref="new-element">🥸</button>'

setTimeout(() => {
  console.log(ref.current.newElement) // -> undefined
})
```

If the watch argument is a function, this will run on watch-change

```ts
const ref = getRefs({ watch: handleChange })

document.body.innerHTML = '<button data-ref="new-element">🥸</button>'

function handleChange() {
  console.log(ref.current.newElement) // -> <button>
}
```

Save all refs as array with asArray:

```html
<body>
  <div data-ref="element"></div>
</body>
```

```ts
const ref = getRefs({ asArray: true })

console.log(ref) // -> { element: [<div>] }
```
