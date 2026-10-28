# Forms

## Contents

- Wrap each control in `label.field`
- Validation is CSS only
- Group checkboxes and radios with a fieldset
- Prefix and suffix go inside the label
- Switch for on/off settings
- Toggle group for short option sets
- Select and datalist
- Form layout

---

## Wrap each control in `label.field`

`label.field` stacks the label, the control and a hint. The first `<span>` is the label. A `<small>` is the hint. A `required` input gets a red asterisk on its own.

**Incorrect:**

```html
<div class="form-group">
  <label for="email" style="font-weight: 600">Email *</label>
  <input id="email" type="email" required />
  <p style="color: gray; font-size: 12px">We'll never share it.</p>
</div>
```

**Correct:**

```html
<label class="field">
  <span>Email</span>
  <input type="email" placeholder="you@example.com" required />
  <small>We'll never share it.</small>
</label>
```

`label.field` works with `<input>`, `<textarea>`, `<select>`, `<progress>`, `input[type=range]`, a `.file-drop` and a `button[popovertarget]`. When the field holds more than one control, use `<div class="field">` so one click doesn't hit the wrong input.

---

## Validation is CSS only

The field shows `<small data-error>` messages through `:user-invalid`. The browser only marks an input invalid after the user touches it. No JavaScript is needed.

| `data-error` | Shows when |
| --- | --- |
| `required` | The input is empty. The input needs a `placeholder` for this one. |
| `invalid` | The value is there but wrong, for example a bad email. |
| `range` | The value is outside `min` / `max`. |

**Incorrect:**

```html
<label class="field">
  <span>Email</span>
  <input type="email" class="error" oninput="validate(this)" />
  <small class="error-text" style="color: red; display: none">Required</small>
</label>
```

**Correct:**

```html
<form novalidate>
  <label class="field">
    <span>Email</span>
    <input type="email" placeholder="you@example.com" required />
    <small data-error="required">Email is required.</small>
    <small data-error="invalid">Enter a valid email address.</small>
  </label>

  <label class="field">
    <span>Age</span>
    <input type="number" placeholder="18" min="18" max="99" required />
    <small data-error="required">Age is required.</small>
    <small data-error="range">Must be between 18 and 99.</small>
  </label>
</form>
```

`novalidate` turns off the browser's own error bubbles so only these messages show. Don't set `novalidate` if you want the browser to block submit on its own.

---

## Group checkboxes and radios with a fieldset

**Incorrect:**

```html
<div>
  <h4>Notifications</h4>
  <div><input type="checkbox" id="n1" /><label for="n1">Email</label></div>
  <div><input type="checkbox" id="n2" /><label for="n2">SMS</label></div>
</div>
```

**Correct:**

```html
<fieldset>
  <legend>Notifications</legend>
  <label><input type="checkbox" name="notify" value="email" /> Email</label>
  <label><input type="checkbox" name="notify" value="sms" /> SMS</label>
  <small>Choose how you'd like to be notified.</small>
</fieldset>
```

Inside a larger form you can also use `div.field` with a `<span>` title. It matches the other fields.

```html
<div class="field">
  <span>Plan</span>
  <label><input type="radio" name="plan" checked /> Free</label>
  <label><input type="radio" name="plan" /> Pro</label>
  <small>You can upgrade at any time.</small>
</div>
```

Always wrap the input in its `<label>`. Then no `id`/`for` pair is needed.

---

## Prefix and suffix go inside the label

Put icons, units, shortcuts and buttons in the same `<label>` as the input. Mark them with `data-prefix` or `data-suffix`. Don't position them with CSS.

**Incorrect:**

```html
<div style="position: relative">
  <svg style="position: absolute; left: 8px; top: 8px">...</svg>
  <input type="search" style="padding-left: 32px" />
</div>
```

**Correct:**

```html
<label>
  <svg data-prefix><!-- search icon --></svg>
  <input type="search" placeholder="Search..." />
  <kbd data-suffix>⌘K</kbd>
</label>

<label>
  <input type="number" placeholder="0.00" />
  <small data-suffix>USD</small>
</label>

<label>
  <input type="text" placeholder="Invite code" />
  <button data-suffix>Apply</button>
</label>
```

Inside a field, nest this label in `div.field`:

```html
<div class="field">
  <span>Price</span>
  <label style="width: 100%">
    <input type="number" placeholder="0.00" min="0" step="0.01" />
    <small data-suffix>USD</small>
  </label>
</div>
```

Add `aria-busy` to the input to show a spinner while it loads.

---

## Switch for on/off settings

A setting that takes effect right away is a switch. A choice the user submits later is a checkbox.

```html
<label>
  <input type="checkbox" class="switch" checked />
  Notifications
</label>
```

---

## Toggle group for short option sets

For 2 to 5 options shown as buttons, use `label.toggle` inside `fieldset[role=group]`. Radios give one choice. Checkboxes give many.

**Incorrect:**

```html
<div>
  <button class="active" onclick="setAlign('left')">Left</button>
  <button onclick="setAlign('center')">Center</button>
</div>
```

**Correct:**

```html
<fieldset role="group">
  <label class="toggle"><input type="radio" name="view" checked /> List</label>
  <label class="toggle"><input type="radio" name="view" /> Grid</label>
  <label class="toggle"><input type="radio" name="view" /> Board</label>
</fieldset>
```

Icon-only toggles add `square`, an `aria-label` and `data-tooltip`:

```html
<label class="toggle square" aria-label="Bold" data-tooltip>
  <input type="checkbox" />
  <svg><!-- bold icon --></svg>
</label>
```

For selectable tags, wrap the input and a badge:

```html
<label><input type="checkbox" checked /><span class="badge">Design</span></label>
```

---

## Select and datalist

A plain `<select>` is styled. In browsers that support `appearance: base-select`, add a `<button>` with `<selectedcontent>` for the custom picker.

```html
<select>
  <button>
    <selectedcontent></selectedcontent>
    <svg><!-- chevron-down --></svg>
  </button>
  <option>Apple</option>
  <option>Banana</option>
</select>
```

For a searchable list with free text, use `<input list>` + `<datalist>`. Don't build a custom combobox unless the user asks.

---

## Form layout

Fields don't come with spacing between them. Stack them with grid or flex.

**Incorrect:**

```html
<form>
  <label class="field" style="margin-bottom: 16px">...</label>
  <label class="field" style="margin-bottom: 16px">...</label>
</form>
```

**Correct:**

```html
<form style="display: grid; gap: var(--ui-spacing-4)">
  <label class="field">...</label>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--ui-spacing-4)">
    <label class="field">...</label>
    <label class="field">...</label>
  </div>
  <button type="submit">Save</button>
</form>
```
