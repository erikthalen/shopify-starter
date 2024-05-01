## Modules

<dl>
<dt><a href="#module_useEvent">useEvent</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#useHydrate">useHydrate()</a> ⇒ <code>useHydrate~hydrate</code> | <code>useHydrate~dehydrate</code></dt>
<dd></dd>
<dt><a href="#useRefs">useRefs([options])</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#setTransition">setTransition(name)</a></dt>
<dd><p>Run this anytime you want to set a specific transition to run on the next page shift</p>
</dd>
<dt><a href="#useTransition">useTransition(options)</a></dt>
<dd></dd>
<dt><a href="#createDevGrid">createDevGrid([options])</a></dt>
<dd><p>Appends some fixed divs to the <code>&lt;body&gt;</code>, which are styled to look like a grid.</p>
</dd>
<dt><a href="#createBarbaScrollPersist">createBarbaScrollPersist()</a></dt>
<dd><p>An attempt to make the content not jump around on the screen while a page navigation is running</p>
</dd>
</dl>

<a name="module_useEvent"></a>

## useEvent

* [useEvent](#module_useEvent)
    * [.listen(name, callback, [options])](#module_useEvent.listen)
    * [.dispatch(name, data, [target])](#module_useEvent.dispatch)
    * [.dehydrate()](#module_useEvent.dehydrate)

<a name="module_useEvent.listen"></a>

### useEvent.listen(name, callback, [options])
**Kind**: static method of [<code>useEvent</code>](#module_useEvent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the event to listen to |
| callback | <code>function</code> | function to run |
| [options] | <code>object</code> | { global: true } never remove listener |

<a name="module_useEvent.dispatch"></a>

### useEvent.dispatch(name, data, [target])
**Kind**: static method of [<code>useEvent</code>](#module_useEvent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of event to dispatch |
| data | <code>\*</code> | payload to emit |
| [target] | <code>HTMLElement</code> | target to emit from, defaults to `window` |

<a name="module_useEvent.dehydrate"></a>

### useEvent.dehydrate()
removes all, non global, events

**Kind**: static method of [<code>useEvent</code>](#module_useEvent)  
<a name="useHydrate"></a>

## useHydrate() ⇒ <code>useHydrate~hydrate</code> \| <code>useHydrate~dehydrate</code>
**Kind**: global function  
**Returns**: <code>useHydrate~hydrate</code> - - the returned function<code>useHydrate~dehydrate</code> - - the returned function again  

| Type | Description |
| --- | --- |
| <code>Array.&lt;function()&gt;</code> | Array of function run loop through |

<a name="useHydrate.hydrate"></a>

### useHydrate.hydrate()
runs though all init functions and saves their return value in an array

**Kind**: static method of [<code>useHydrate</code>](#useHydrate)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | n arguments that should be passed to the components |

<a name="useRefs"></a>

## useRefs([options]) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - { myRef: div, another: [button, span] }  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  | Options object |
| [options.root] | <code>HTMLElement</code> | <code>document.body</code> | Element to querySelect in |
| [options.namespaced] | <code>boolean</code> |  | Only get children with data-ref-parent-ref |
| [options.exclude] | <code>HTMLElement</code> |  | Element and elements children wont be selected |
| [options.watch] | <code>boolean</code> \| <code>function</code> |  | Watches DOM and updates refs on mutation |
| [options.asArray] | <code>boolean</code> |  | Saves all refs in arrays, also single elements |

<a name="setTransition"></a>

## setTransition(name)
Run this anytime you want to set a specific transition to run on the next page shift

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The key of a set of hooks to run next page shift |

<a name="useTransition"></a>

## useTransition(options)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options object |
| options.page | <code>object</code> | An object where each key is a set of any Barba hooks |
| options.global | <code>object</code> | A set of any Barba hooks |
| options.barbaOptions | <code>object</code> | Any overwriting Barba options |

<a name="createDevGrid"></a>

## createDevGrid([options])
Appends some fixed divs to the `<body>`, which are styled to look like a grid.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | changes the appearance of the grid |

<a name="createBarbaScrollPersist"></a>

## createBarbaScrollPersist()
An attempt to make the content not jump around on the screen while a page navigation is running

**Kind**: global function  
