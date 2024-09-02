# A la Cart

Made to be a more or less drop-in replacement to the Dawn cart. Has options and functions to make it dynamic enough to work in most situations.

Handles cart and add-to-cart-form. Runs a few custom events on cart updates.

Cart can be either a normal page, or a drawer-cart that renders in the current page.

## Installation

Run the default export after page load, and after navigation.

```js
import useALaCart from './a-la-cart'

useALaCart(/* options */)
```

## parameters

| Param                         | Type        | Default                 | Description                                             |
| ----------------------------- | ----------- | ----------------------- | ------------------------------------------------------- |
| [options]                     |             |                         | Options object                                          |
| [options.cartSectionSelector] | string      | '.main-cart'            | Selector of the cart, this is what's getting rerendered |
| [options.productFormSelector] | string      | '.shopify-product-form' | Selector of the PDP form, to add to cart                |
| [options.productFormParser]   | function    |                         | A function returning a add-to-cart object               |
| [options.drawerContainer]     | HTMLElement |                         | Will make the cart render inside this element           |

## Cart

Will automatically listen on- and update the cart page, on user interaction.

Initialize the A la Cart with a selector of the whole cart-section. Any `<form>` within this element will be listened on for changes.

```twig
<!-- This will be re-rendered on change -->
<section class="my-cart">
  <!-- This will be listened on for changes -->
  <form action="{{ routes.cart_url }}" method="post" id="cart">
    {%- for item in cart.items -%}
      <!-- normal links are ignored by script -->
      <a href="{{ item.url }}">{{ item.product.title | escape }}</a>

      <!-- remove-links is handled by the script -->
      <a href="{{ item.url_to_remove }}">Remove</a>

      <!-- inputs with `name="updates[]"` are handled by script -->
      <input
        type="number"
        name="updates[]"
        value="{{ item.quantity }}"
        id="{{ item.variant.id }}"
        min="0"
      >
    {% endfor %}
  </form>

  <!-- submit is ignored by script -->
  <button form="cart" type="submit">Checkout</button>
</section>
```

```js
import useALaCart from './a-la-cart'

useALaCart({
  cartSelector: '.my-cart',
})
```

## Drawer

Pass an element as `drawerContainer` to make the cart render in this element. In the current page.

```html
<html>
  <body>
    <div id="drawer-cart">
      <!-- render cart here -->
    </div>

    <!-- other content -->
  </body>
</html>
```

```js
import useALaCart from './a-la-cart'

useALaCart({
  drawerContainer: document.getElementById('drawer-cart'),
})
```

## Product form

Will automatically listen on- and update the PDP add to cart form.

```twig
{%- form 'product', product, novalidate: 'novalidate' -%}
  <!-- input with `name="id"` are handled by script by default -->
  <select name="id">
    {% for variant in product.variants %}
      <option value="{{ variant.id }}">
        {{ variant.title }} - {{ variant.id }}
      </option>
    {% endfor %}
  </select>

  <!-- input with `name="quantity"` are handled by script by default -->
  <input type="number" value="1" name="quantity">

  <!-- submit are handled by script -->
  <button type="submit" name="add">Buy</button>
{%- endform -%}
```

Depending on project, the product form probably need specific parsing. Add your custom parser that returns a [shopify add-to-cart-body](https://shopify.dev/docs/api/ajax/reference/cart)

```js
import useALaCart from './a-la-cart'

useALaCart({
  productFormParser: form => {
    const data = new FormData(form)
    const [size] = data.getAll('size')
    const VARIANT_IDS = { S: '1234', M: '4321', L: '6789' }

    return {
      items: [
        {
          id: VARIANT_IDS[size],
          quantity: 1,
        },
      ],
    }
  },
})
```

## Events

### a-la-cart.is-updating

Dispatched by script when a fetch is pending.
Useful for managing loading state.

```js
// my-component.js
window.addEventListener('a-la-cart.is-updating', e => {
  console.log('Product is being added to cart: ', e.detail)
})
```

### a-la-cart.product-added

Dispatched when a product was successfully added to the cart.
Useful for showing notifications etc.

```js
// my-component.js
window.addEventListener('a-la-cart.product-added', e => {
  console.log('Product added to cart: ', e.detail)
})
```

### a-la-cart.drawer-opened

Dispatched when the drawer-cart is successfully fetched and opened.

```js
// my-component.js
window.addEventListener('a-la-cart.drawer-opened', () => {
  console.log('Drawer is open')
})
```

### a-la-cart.close-drawer

Listened on by script. Fire this event to remove/close the drawer, when drawer-cart is enabled.

```js
// my-component.js
myCloseButton.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('a-la-cart.close-drawer'))
})
```