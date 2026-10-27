# Composition

## Contents

- Card is `<article>`
- Callouts are alerts
- Use badges for status
- Empty states use `.empty`
- Loading states
- Buttons vs links
- Button variants
- Tabs
- Typography
- Use native elements before custom markup

---

## Card is `<article>`

`<article>` is the card. `<header>` and `<footer>` must be direct children to get the card's header and footer styling.

**Incorrect:**

```html
<div class="card" style="border: 1px solid #ddd; border-radius: 8px; padding: 16px">
  <div class="card-title">Team</div>
  <div class="card-body">Invite people.</div>
</div>
```

**Correct:**

```html
<article>
  <header><strong>Team</strong></header>
  <p>Invite people to collaborate.</p>
  <footer>
    <button class="outlined">Cancel</button>
    <button>Invite</button>
  </footer>
</article>
```

Variants: `secondary`, `tertiary`, `transparent`. Don't wrap the card's body in another `div` with padding. The card pads its children itself.

---

## Callouts are alerts

An alert is an `<article>` with a role. Use `role="alert"` for urgent messages and `role="status"` for calm ones. The icon, `<strong>` title and `<p>` body lay out on their own.

**Incorrect:**

```html
<div style="background: #fee; color: #c00; padding: 12px; border-radius: 6px">
  ⚠️ Unable to connect.
</div>
```

**Correct:**

```html
<article role="alert" class="destructive">
  <svg><!-- alert icon --></svg>
  <strong>Unable to connect</strong>
  <p>Check your connection and try again.</p>
  <button class="destructive">Retry</button>
</article>
```

Colors: `primary`, `constructive`, `destructive`, `color1` to `color6`. A dismiss button is `<button class="ghost square round" aria-label="Dismiss">`.

---

## Use badges for status

**Incorrect:**

```html
<span style="color: green; font-weight: bold">+20.1%</span>
<span class="pill pill-red">Failed</span>
```

**Correct:**

```html
<span class="badge constructive">+20.1%</span>
<span class="badge destructive">Failed</span>
<span class="badge outlined">Draft</span>
```

A badge next to a heading goes in `<sup class="badge">`. A badge inside an avatar becomes a presence dot.

---

## Empty states use `.empty`

**Incorrect:**

```html
<div style="text-align: center; padding: 48px; color: #888">
  <p>No results</p>
</div>
```

**Correct:**

```html
<section class="empty">
  <svg><!-- icon --></svg>
  <h3>No results found</h3>
  <p>Try adjusting your search or filters.</p>
  <footer>
    <button class="outlined">Clear filters</button>
    <button>New item</button>
  </footer>
</section>
```

---

## Loading states

| Case | Use |
| --- | --- |
| Button is working | `<button aria-busy disabled>Saving…</button>` |
| Spinner anywhere | `<span aria-busy></span>` |
| Input is loading | `<input aria-busy />` |
| Content placeholder | `<div class="skeleton" style="width: 12rem"></div>` |
| Placeholder the size of real text | `<p class="skeleton">Real text here</p>` |
| Round placeholder | `<div class="skeleton circle" style="width: 3rem"></div>` |
| Known progress | `<progress value="40" max="100"></progress>` |
| Unknown progress | `<progress></progress>` |

**Incorrect:**

```html
<button disabled><div class="spinner"></div> Saving</button>
<div class="animate-pulse bg-gray-200 h-4 w-48"></div>
```

**Correct:**

```html
<button aria-busy disabled>Saving…</button>
<div class="skeleton" style="width: 12rem"></div>
```

---

## Buttons vs links

Use `<button>` for actions. Use `<a>` for navigation. If a link must look like a button, add `class="button"`. All button variants work on it.

**Incorrect:**

```html
<button onclick="location.href='/media'">Go to media</button>
<a href="#" onclick="save()">Save</a>
```

**Correct:**

```html
<a href="/media" class="button">Go to media</a>
<button>Save</button>
```

---

## Button variants

| Class | Use for |
| --- | --- |
| (none) | Main action |
| `outlined` | Secondary action, cancel |
| `secondary` | Quiet filled action |
| `ghost` | Toolbar, menu items, table row actions |
| `link` | Inline text action |
| `destructive` | Delete, remove. Combine with `ghost` for a quiet version |
| `square` | Icon-only button |
| `round` | Fully rounded |

Icon-only buttons need an `aria-label`. Add `data-tooltip` to show it on hover.

```html
<button class="ghost square" aria-label="Copy" data-tooltip>
  <svg><!-- copy icon --></svg>
</button>
```

Icons, `<kbd>` and `.badge` inside a button lay out on their own:

```html
<button><svg><!-- save --></svg> Save <kbd>⌘S</kbd></button>
<button class="outlined">Chat <span class="badge color3">6</span></button>
```

---

## Tabs

Tabs that switch content on the same page use hidden radios and `:has()`. No JavaScript.

```html
<section class="tabs">
  <header role="tablist" aria-label="Account settings">
    <label><input type="radio" name="tabs" id="tab-1" checked aria-controls="panel-1" /> Account</label>
    <label><input type="radio" name="tabs" id="tab-2" aria-controls="panel-2" /> Password</label>
  </header>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">...</div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0">...</div>
</section>
```

Panels follow the order of the radios. Each tabs block on a page needs its own radio `name`.

Tabs that go to other pages are links:

```html
<nav class="tab-links" aria-label="Views">
  <a href="/overview" aria-current="page">Overview</a>
  <a href="/activity">Activity</a>
</nav>
```

---

## Typography

Headings, paragraphs and lists are styled with no class. Add `.prose` to a container to get vertical spacing between them. Use `<hgroup>` for a heading with a subtitle.

**Incorrect:**

```html
<div>
  <h2 style="margin-bottom: 4px">Tasks</h2>
  <p style="color: #666; margin-top: 0">Your tasks for this month.</p>
</div>
```

**Correct:**

```html
<hgroup>
  <h2>Tasks</h2>
  <p>Your tasks for this month.</p>
</hgroup>
```

Use `<small>` for quiet secondary text. Use `<code>` and `<kbd>` as normal.

---

## Use native elements before custom markup

| Instead of | Use |
| --- | --- |
| `<div class="divider">` or `border-top` | `<hr>` or `<hr data-label="Section">` |
| Custom accordion with JS | `<details><summary>Title</summary><div>Body</div></details>` |
| One-open-at-a-time accordion with JS | Same `name` on each `<details>` |
| Key/value rows in a grid of `div`s | `<dl><dt>Name</dt><dd>Ada</dd></dl>` |
| Avatar `div` with `border-radius: 50%` | `<img class="avatar" src="..." alt="" />` |
| Breadcrumb `div`s with `/` separators | `<nav aria-label="Breadcrumb"><ol><li><a>...</a></li></ol></nav>` |
| Custom stepper markup | `<ol class="timeline">` with `data-filled` on done steps |
| Custom data grid | `<table>` with `--cols` for column sizes |
