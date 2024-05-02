## Modules

<dl>
<dt><a href="#module_useEvent">useEvent</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#useHydrate">useHydrate()</a> ⇒ <code>useHydrate~hydrate</code> | <code>useHydrate~dehydrate</code></dt>
<dd><p>Used to initialize components, for when the window doesn&#39;t reload fully.</p>
</dd>
<dt><a href="#useRefs">useRefs([options])</a> ⇒ <code>Object</code></dt>
<dd><p>Collect all dom elements with the attribute [data-ref]</p>
</dd>
<dt><a href="#useTransition">useTransition(options)</a></dt>
<dd><p>Used to trigger and run specific transitions not tied to specific routes (as is Barba default behavior).</p>
</dd>
<dt><a href="#setTransition">setTransition(name)</a></dt>
<dd><p>Run this anytime you want to set a specific transition to run on the next page shift</p>
</dd>
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
Used to initialize components, for when the window doesn't reload fully.

**Kind**: global function  
**Returns**: <code>useHydrate~hydrate</code> - - the returned function<code>useHydrate~dehydrate</code> - - the returned function again  

| Type | Description |
| --- | --- |
| <code>Array.&lt;function()&gt;</code> | Array of function run loop through |


* [useHydrate()](#useHydrate) ⇒ <code>useHydrate~hydrate</code> \| <code>useHydrate~dehydrate</code>
    * [.hydrate()](#useHydrate.hydrate)
    * [.dehydrate()](#useHydrate.dehydrate)

<a name="useHydrate.hydrate"></a>

### useHydrate.hydrate()
Runs all the passed functions. Any arguments passed will be passed on to the components

**Kind**: static method of [<code>useHydrate</code>](#useHydrate)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | n arguments that should be passed to the components |

<a name="useHydrate.dehydrate"></a>

### useHydrate.dehydrate()
Runs any/all the returned functions returned from the `hydrate`

**Kind**: static method of [<code>useHydrate</code>](#useHydrate)  
<a name="useRefs"></a>

## useRefs([options]) ⇒ <code>Object</code>
Collect all dom elements with the attribute [data-ref]

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

<a name="useTransition"></a>

## useTransition(options)
Used to trigger and run specific transitions not tied to specific routes (as is Barba default behavior).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options object |
| options.page | <code>object</code> | An object where each key is a set of any Barba hooks |
| options.global | <code>object</code> | A set of any Barba hooks |
| options.barbaOptions | <code>object</code> | Any overwriting Barba options |

<a name="setTransition"></a>

## setTransition(name)
Run this anytime you want to set a specific transition to run on the next page shift

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The key of a set of hooks to run next page shift |

<a name="createDevGrid"></a>

## createDevGrid([options])
Appends some fixed divs to the `<body>`, which are styled to look like a grid.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | Options object |
| [options.cols] | <code>number</code> | Amount of columns |
| [options.bleed] | <code>string</code> | Horizontal space outside the grid |
| [options.gap] | <code>string</code> | Horizontal space between columns |
| [options.color] | <code>string</code> | A CSS-hsl string defining the color of the grid |

<a name="createBarbaScrollPersist"></a>

## createBarbaScrollPersist()
An attempt to make the content not jump around on the screen while a page navigation is running

**Kind**: global function  
