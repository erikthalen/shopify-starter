# Overlays

Every overlay uses a browser feature. Dialogs use `<dialog>`. Menus, popovers and toasts use the Popover API. All of them render in the top layer, so none of them need `z-index`.

## Contents

- Choosing an overlay
- Popover and dropdown
- Popovers go outside a button group
- Menu structure
- Nested menus
- Dialog
- Drawer
- Tooltip
- Toast

---

## Choosing an overlay

| Need | Use |
| --- | --- |
| List of actions from a button | Popover with a `<menu>` |
| Small panel with controls | Popover with an `<article>` |
| Ask the user to confirm or fill a form | `<dialog>` opened with `showModal()` |
| Panel from the side or bottom | `<dialog class="drawer">` |
| Side panel that leaves the page usable | `<div popover class="drawer">` |
| Short label on hover | `data-tooltip` |
| Short message that comes and goes | `<div popover class="toast">` |

---

## Popover and dropdown

A button with `popovertarget` opens the element with the same `id`. The popover sits below its trigger by default. Place the popover right after the trigger. The trigger then shows an open state.

**Incorrect:**

```html
<div class="dropdown">
  <button onclick="this.nextElementSibling.classList.toggle('open')">Actions</button>
  <ul class="dropdown-menu" style="position: absolute; z-index: 50">...</ul>
</div>
```

**Correct:**

```html
<button popovertarget="actions">Actions</button>
<div id="actions" popover>
  <menu>
    <li><button class="ghost">Edit</button></li>
    <li><button class="ghost">Duplicate</button></li>
  </menu>
</div>
```

Popover options:

- `data-placement` changes the side, for example `"top"`, `"bottom right"`, `"right top"`.
- `popover="manual"` stays open until the user closes it. Close it with a button that has `popovertarget="id"` and `popovertargetaction="hide"`.
- Put an `<article>` inside for a panel with a header and footer.

Every popover `id` on the page must be unique. In a list or table, add the row id: `popovertarget="actions-42"`.

### Popovers go outside a button group

When the trigger is inside a button group (`<fieldset role="group">`), put the popover after the closing `</fieldset>`, not inside it. The group rounds the corners of its first and last child. A popover inside the group counts as a child, so the last button loses its rounded corners. The `popovertarget` link still works when the popover is outside.

**Incorrect:**

```html
<fieldset role="group">
  <button class="ghost">Snooze</button>
  <button class="ghost square" aria-label="More" popovertarget="more">
    <svg><!-- dots --></svg>
  </button>
  <div id="more" popover>
    <menu>...</menu>
  </div>
</fieldset>
```

**Correct:**

```html
<fieldset role="group">
  <button class="ghost">Snooze</button>
  <button class="ghost square" aria-label="More" popovertarget="more">
    <svg><!-- dots --></svg>
  </button>
</fieldset>
<div id="more" popover>
  <menu>...</menu>
</div>
```

---

## Menu structure

`<menu>` is styled with no class. Each item is an `<li>`.

```html
<menu>
  <li><small>Actions</small></li>
  <li><button class="ghost"><svg><!-- edit --></svg> Edit</button></li>
  <li><button class="ghost">Duplicate</button></li>
  <li><hr /></li>
  <li><small>Danger zone</small></li>
  <li><button class="ghost destructive">Delete</button></li>
</menu>
```

- Items are `<button class="ghost">`, or `<a class="button ghost">` for links.
- Separators are `<li><hr /></li>`.
- Group labels are `<li><small>`.
- Single choice items are `<li><label><input type="radio" name="sort" /> Newest</label></li>`.
- Multiple choice items use checkboxes the same way.

**Incorrect:**

```html
<div popover id="m">
  <button class="ghost">Edit</button>
  <div class="separator"></div>
  <button class="ghost" style="color: red">Delete</button>
</div>
```

**Correct:**

```html
<div popover id="m">
  <menu>
    <li><button class="ghost">Edit</button></li>
    <li><hr /></li>
    <li><button class="ghost destructive">Delete</button></li>
  </menu>
</div>
```

---

## Nested menus

Put the child popover inside the parent `<li>`, next to its trigger. Set `data-placement="right top"`.

```html
<li>
  <button class="ghost" popovertarget="find-menu">Find</button>
  <div id="find-menu" popover data-placement="right top">
    <menu>
      <li><button class="ghost">Find next</button></li>
    </menu>
  </div>
</li>
```

---

## Dialog

A dialog holds an `<article>`. The article gives it the card surface. `closedby="any"` lets the user close it with Escape or a click outside. Buttons inside `<form method="dialog">` close it with no JavaScript.

**Incorrect:**

```html
<div class="modal-backdrop" style="position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,.5)">
  <div class="modal">...</div>
</div>
```

**Correct:**

```html
<button onclick="document.getElementById('confirm').showModal()">Delete</button>

<dialog id="confirm" closedby="any">
  <article>
    <header><strong>Delete project?</strong></header>
    <p>This can't be undone.</p>
    <footer>
      <form method="dialog">
        <button class="destructive" value="delete">Delete</button>
        <button class="outlined">Cancel</button>
      </form>
    </footer>
  </article>
</dialog>
```

- `showModal()` opens a modal with a backdrop. `show()` opens it without one.
- Use `closedby="none"` when the user must pick a button.
- Always give the dialog a title in `<header>`.
- Read the button that closed it from `dialog.returnValue`.

---

## Drawer

A drawer is a dialog with `class="drawer"`. It slides in from an edge.

```html
<dialog id="filters" class="drawer" data-position="right" closedby="any">
  <article>
    <header><strong>Filters</strong></header>
    <p>...</p>
    <footer>
      <form method="dialog">
        <button>Apply</button>
        <button class="outlined">Cancel</button>
      </form>
    </footer>
  </article>
</dialog>
```

`data-position` is `left`, `right`, `top` or `bottom`.

For a drawer without a backdrop, put `class="drawer"` on a popover. The page behind stays usable. Clicking outside or pressing Esc closes it.

```html
<button popovertarget="notifications">Notifications</button>
<div id="notifications" class="drawer" popover>
  <article>
    <header><strong>Notifications</strong></header>
    <p>...</p>
    <footer>
      <button class="outlined" popovertarget="notifications" popovertargetaction="hide">Close</button>
    </footer>
  </article>
</div>
```

---

## Tooltip

Add `data-tooltip` and `aria-label` to the trigger. The label text is the tooltip. It shows on hover and on keyboard focus.

**Incorrect:**

```html
<span class="tooltip-wrapper">
  <button>?</button>
  <span class="tooltip">Help</span>
</span>
```

**Correct:**

```html
<button class="ghost square" aria-label="Help" data-tooltip>
  <svg><!-- help icon --></svg>
</button>
```

Set the side with `data-tooltip="bottom"`, `"left"` or `"right"`. The default is top. Tooltips don't work on `<input>`, `<select>` or `<textarea>`.

---

## Toast

A toast is a popover with `class="toast"`. Put an alert `<article>` inside.

```html
<button popovertarget="saved">Save</button>

<div id="saved" popover="manual" class="toast" data-placement="bottom right">
  <article role="status" class="constructive">
    <svg><!-- check icon --></svg>
    <strong>Profile updated</strong>
    <button class="ghost square round" aria-label="Dismiss"
      popovertarget="saved" popovertargetaction="hide">
      <svg><!-- x icon --></svg>
    </button>
  </article>
</div>
```

To show it from code, call `element.showPopover()`.

To stack many toasts, put them as siblings in one container. Open toasts then fan out behind the newest one, up to 6 deep.

```html
<div id="toast-stack">
  <div id="toast-1" popover="manual" class="toast" data-placement="bottom right">...</div>
  <div id="toast-2" popover="manual" class="toast" data-placement="bottom right">...</div>
</div>
```
