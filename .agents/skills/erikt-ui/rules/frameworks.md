# Frameworks

erikt/ui is plain CSS. It works the same in every framework. The markup in the docs is HTML, so translate it to the project's syntax. Keep the elements, attributes and class names the same.

## Contents

- Install
- React
- Vue and Svelte
- Tailwind
- Boolean attributes that the CSS reads

---

## Install

Use the setup the project already has.

```html
<!-- No build step -->
<link rel="stylesheet" href="https://esm.sh/@erikt/ui" />
```

```css
/* In a global stylesheet, with @erikt/ui installed from npm */
@import "@erikt/ui";
```

Load it once, globally. Don't import it per component.

---

## React

Translate attributes to JSX:

| HTML | JSX |
| --- | --- |
| `class="ghost"` | `className="ghost"` |
| `for="email"` | `htmlFor="email"` |
| `popovertarget="menu"` | `popoverTarget="menu"` |
| `popovertargetaction="hide"` | `popoverTargetAction="hide"` |
| `checked` (no state) | `defaultChecked` |
| `style="--cols: 2fr 1fr"` | `style={{ "--cols": "2fr 1fr" }}` |
| `onclick="...showModal()"` | a `ref` and `onClick={() => ref.current?.showModal()}` |
| `closedby="any"` | `closedby="any"` (lowercase, passed through) |

**Incorrect:**

```tsx
const [open, setOpen] = useState(false);

<div className="relative">
  <button onClick={() => setOpen(!open)}>Actions</button>
  {open && <div className="absolute z-50 rounded border bg-white shadow">...</div>}
</div>
```

**Correct:**

```tsx
<>
  <button popoverTarget="row-actions">Actions</button>
  <div id="row-actions" popover="auto">
    <menu>
      <li><button className="ghost">Edit</button></li>
      <li><hr /></li>
      <li><button className="ghost destructive">Delete</button></li>
    </menu>
  </div>
</>
```

Use `useId()` for popover and dialog ids in components that render more than once.

A dialog in React:

```tsx
const ref = useRef<HTMLDialogElement>(null);

<>
  <button onClick={() => ref.current?.showModal()}>Edit profile</button>
  <dialog ref={ref} closedby="any">
    <article>
      <header><strong>Edit profile</strong></header>
      ...
      <footer>
        <form method="dialog">
          <button>Save</button>
          <button className="outlined">Cancel</button>
        </form>
      </footer>
    </article>
  </dialog>
</>
```

Keep native state where you can. A `<details>`, tab radios or a popover don't need `useState` unless other code must read their state.

---

## Vue and Svelte

Both pass HTML attributes through as written. Use `popovertarget`, `class` and `closedby` as in the docs. For dynamic ids, bind them (`:id` in Vue, `id={id}` in Svelte).

---

## Tailwind

Use Tailwind classes for layout only. `flex`, `grid`, `gap-*`, `col-span-*`, `w-full` and `max-w-*` are fine. Don't add Tailwind color, border, radius, padding or font classes to erikt/ui components.

**Incorrect:**

```html
<button class="bg-blue-600 text-white rounded-md px-4 py-2">Save</button>
<span class="badge bg-green-100 text-green-800">Active</span>
```

**Correct:**

```html
<div class="flex gap-2">
  <button>Save</button>
  <span class="badge constructive">Active</span>
</div>
```

For your own elements, read the erikt/ui tokens instead of Tailwind's scale, so they follow `--ui-rounded-scale` and the theme.

```html
<!-- Incorrect -->
<div class="rounded-xl bg-gray-100 p-4">...</div>

<!-- Correct (Tailwind v4 syntax; in v3 use rounded-[var(--ui-rounded-5)]) -->
<div class="rounded-(--ui-rounded-5) bg-(--ui-neutral-100) p-(--ui-spacing-4)">...</div>
```

---

## Boolean attributes that the CSS reads

The CSS checks if `aria-busy`, `data-filled` and `data-tooltip` exist, not their value. `aria-busy="false"` still shows a spinner.

**Incorrect:**

```tsx
<button aria-busy={saving}>Save</button>
```

**Correct:**

```tsx
<button aria-busy={saving || undefined} disabled={saving}>Save</button>
```

In Vue, bind `:aria-busy="saving || undefined"`. In Svelte, `aria-busy={saving || undefined}`.
