## Modules

<dl>
<dt><a href="#module_useEvents">useEvents</a></dt>
<dd></dd>
<dt><a href="#module_useTransition">useTransition</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#setTransition">setTransition</a></dt>
<dd><p>Run this anytime you want to set a specific transition to run on the next page shift</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#useHydrate">useHydrate()</a> ⇒ <code>useHydrate~hydrate</code> | <code>useHydrate~dehydrate</code></dt>
<dd></dd>
<dt><a href="#hydrate">hydrate()</a></dt>
<dd><p>runs though all init functions and saves their return value in an array</p>
</dd>
<dt><a href="#dehydrate">dehydrate()</a></dt>
<dd><p>runs though previously saved return values</p>
</dd>
<dt><a href="#useRefs">useRefs([options])</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#createDevGrid">createDevGrid(options)</a></dt>
<dd><p>Appends some fixed divs to the <code>&lt;body&gt;</code>, which are styled to look like a grid.</p>
</dd>
<dt><a href="#createBarbaScrollPersist">createBarbaScrollPersist()</a></dt>
<dd><p>An attempt to make the content not jump around on the screen while a page navigation is running</p>
</dd>
</dl>

<a name="module_useEvents"></a>

## useEvents

* [useEvents](#module_useEvents)
    * [.listen(name, cb, [options])](#module_useEvents.listen)
    * [.dispatch(name, data, [target])](#module_useEvents.dispatch)
    * [.dehydrate()](#module_useEvents.dehydrate)

<a name="module_useEvents.listen"></a>

### useEvents.listen(name, cb, [options])
**Kind**: static method of [<code>useEvents</code>](#module_useEvents)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the event to listen to |
| cb | <code>function</code> | callback to run |
| [options] | <code>object</code> | { global: true } never remove listener |

<a name="module_useEvents.dispatch"></a>

### useEvents.dispatch(name, data, [target])
**Kind**: static method of [<code>useEvents</code>](#module_useEvents)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of event to dispatch |
| data | <code>\*</code> | payload to emit |
| [target] | <code>HTMLElement</code> | target to emit from, defaults to `window` |

<a name="module_useEvents.dehydrate"></a>

### useEvents.dehydrate()
removes all, non global, events

**Kind**: static method of [<code>useEvents</code>](#module_useEvents)  
<a name="module_useTransition"></a>

## useTransition
<a name="exp_module_useTransition--module.exports"></a>

### module.exports(options) ⏏
transitions is an object where the key is the name to be used for triggering the transition, and the value is any of the barba js hooks to run to perform the transition

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| options |  |  |
| options.transitions | <code>object</code> | An object where each key is a set of any Barba hooks |
| options.globals | <code>object</code> | A set of any Barba hooks |
| options.barbaOptions | <code>object</code> | Any overwriting Barba options |

<a name="setTransition"></a>

## setTransition
Run this anytime you want to set a specific transition to run on the next page shift

**Kind**: global constant  

| Type | Description |
| --- | --- |
| <code>string</code> | The key of a set of hooks to run next page shift |

<a name="useHydrate"></a>

## useHydrate() ⇒ <code>useHydrate~hydrate</code> \| <code>useHydrate~dehydrate</code>
**Kind**: global function  
**Returns**: <code>useHydrate~hydrate</code> - - the returned function<code>useHydrate~dehydrate</code> - - the returned function again  

| Type | Description |
| --- | --- |
| <code>Array.&lt;function()&gt;</code> | Array of function run loop through |

<a name="hydrate"></a>

## hydrate()
runs though all init functions and saves their return value in an array

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | n arguments that should be passed to the components |

<a name="dehydrate"></a>

## dehydrate()
runs though previously saved return values

**Kind**: global function  
<a name="useRefs"></a>

## useRefs([options]) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - { myRef: div, another: [button, span] }  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] |  |  | Options controlling how elements are querySelected |
| [options.root] | <code>HTMLElement</code> | <code>document.body</code> | Element to querySelect in |
| [options.namespaced] | <code>boolean</code> |  | Only get children with data-ref-parent-ref |
| [options.exclude] | <code>string</code> |  | Selector or element who's children wont be selected |
| [options.watch] | <code>boolean</code> \| <code>function</code> |  | Watches DOM and updates refs on mutation |
| [options.asArray] | <code>boolean</code> |  | Saves all refs in arrays, also single elements |

<a name="createDevGrid"></a>

## createDevGrid(options)
Appends some fixed divs to the `<body>`, which are styled to look like a grid.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | changes the appearance of the grid |

<a name="createBarbaScrollPersist"></a>

## createBarbaScrollPersist()
An attempt to make the content not jump around on the screen while a page navigation is running

**Kind**: global function  
