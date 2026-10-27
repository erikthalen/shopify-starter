# Recipes

Larger UI built only from erikt/ui parts. Each recipe lists the parts it uses and why. Copy the structure, then change the content.

The rule for every recipe: the library styles the parts. Your CSS only places them (`flex`, `grid`, `width`, `position`).

## Contents

- Login or signup card
- Settings page
- Confirmation modal
- Table with toolbar and pagination
- Stat tiles
- Pricing card

---

## Login or signup card

Built from: `<article>` (the card), `.empty` (centered icon, heading, text and actions), round buttons, `<hr data-label>` (the "OR" divider).

`.empty` is not only for empty lists. Use it for any centered block of icon + heading + text + actions. Inside a card, lower its padding to `var(--ui-spacing-4)`, because the card already has padding.

```html
<article style="position: relative; max-width: 22rem">
  <button
    class="secondary round"
    aria-label="Close"
    style="position: absolute; top: var(--ui-spacing-3); right: var(--ui-spacing-3)"
  >
    <svg><!-- x --></svg>
  </button>

  <section class="empty" style="padding: var(--ui-spacing-4)">
    <svg><!-- user --></svg>
    <h3>Create an account</h3>
    <p>Start your free 7-day trial. No credit card required.</p>

    <button class="round" style="width: 100%">Get started</button>
    <hr data-label="OR" />
    <button class="secondary round" style="width: 100%">
      <svg><!-- google --></svg> Continue with Google
    </button>
    <button class="secondary round" style="width: 100%">
      <svg><!-- apple --></svg> Continue with Apple
    </button>
  </section>
</article>
```

To show it as a modal, put the `<article>` inside `<dialog closedby="any">` and make the close button a `<form method="dialog">` button.

For a form with email and password, put `label.field` inputs after the `<p>`, inside a `<form>` with `width: 100%`.

---

## Settings page

Built from: `section.tabs` (sections), `<article>` with `<header>` and `<footer>` (one card per group), `label.field` (inputs), `.switch` (settings that apply right away).

```html
<section class="tabs">
  <header role="tablist" aria-label="Settings">
    <label><input type="radio" name="settings" id="tab-profile" checked aria-controls="panel-profile" /> Profile</label>
    <label><input type="radio" name="settings" id="tab-alerts" aria-controls="panel-alerts" /> Notifications</label>
  </header>

  <div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile" tabindex="0">
    <article>
      <header><strong>Profile</strong></header>
      <div style="display: grid; gap: var(--ui-spacing-4)">
        <label class="field">
          <span>Name</span>
          <input placeholder="Ada Lovelace" />
        </label>
        <label class="field">
          <span>Email</span>
          <input type="email" placeholder="ada@example.com" />
          <small>We never share your email.</small>
        </label>
      </div>
      <footer>
        <button>Save</button>
      </footer>
    </article>
  </div>

  <div role="tabpanel" id="panel-alerts" aria-labelledby="tab-alerts" tabindex="0">
    <article style="display: grid; gap: var(--ui-spacing-3)">
      <label><input type="checkbox" class="switch" checked /> Email notifications</label>
      <label><input type="checkbox" class="switch" /> Weekly summary</label>
    </article>
  </div>
</section>
```

---

## Confirmation modal

Built from: `<dialog>` (top layer, backdrop, Escape to close), `<article>` (the surface), `<footer>` with a `<form method="dialog">` (closes with no JavaScript), a `destructive` button.

```html
<button class="ghost destructive" onclick="document.getElementById('delete-project').showModal()">
  Delete project
</button>

<dialog id="delete-project" closedby="any">
  <article>
    <header><strong>Delete project?</strong></header>
    <p>All files in this project are removed. You can't undo this.</p>
    <footer>
      <form method="dialog">
        <button class="destructive">Delete</button>
        <button class="outlined">Cancel</button>
      </form>
    </footer>
  </article>
</dialog>
```

---

## Table with toolbar and pagination

Built from: `<article>` with `<header>` (toolbar) and `<footer>` (pagination), a search `<label>` with `data-prefix`, `<table>`, `.badge` (status), a ghost `square` button with a popover `<menu>` (row actions), `nav.pagination`.

```html
<article>
  <header style="justify-content: space-between">
    <strong>Orders</strong>
    <label>
      <svg data-prefix><!-- search --></svg>
      <input type="search" placeholder="Search orders" />
    </label>
  </header>

  <table>
    <thead>
      <tr><th>Order</th><th>Status</th><th></th></tr>
    </thead>
    <tbody>
      <tr>
        <td>#1042</td>
        <td><span class="badge constructive">Paid</span></td>
        <td>
          <button class="ghost square" popovertarget="row-1042" aria-label="Actions">
            <svg><!-- dots --></svg>
          </button>
          <div id="row-1042" popover>
            <menu>
              <li><button class="ghost">View</button></li>
              <li><hr /></li>
              <li><button class="ghost destructive">Refund</button></li>
            </menu>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <footer>
    <nav class="pagination" aria-label="Pagination">
      <ul>
        <li><a href="?page=1" class="button ghost square" aria-current="page">1</a></li>
        <li><a href="?page=2" class="button ghost square">2</a></li>
      </ul>
    </nav>
  </footer>
</article>
```

If the table has no rows, show a `section.empty` in its place.

---

## Stat tiles

Built from: `<article class="secondary">` (a quiet surface), `<small>` (label), `<strong>` (value), `.badge` (change).

```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: var(--ui-spacing-3)">
  <article class="secondary" style="display: grid; gap: var(--ui-spacing-1)">
    <small>Revenue</small>
    <strong>$12,400</strong>
    <span class="badge constructive">+12%</span>
  </article>
  <article class="secondary" style="display: grid; gap: var(--ui-spacing-1)">
    <small>Refunds</small>
    <strong>$320</strong>
    <span class="badge destructive">+4%</span>
  </article>
</div>
```

---

## Pricing card

Built from: `<article>` with `<header>` and `<footer>`, `<hgroup>` (plan name and price), `.badge` (highlight), a plain `<ul>` (features), a full-width button.

```html
<article>
  <header style="justify-content: space-between">
    <strong>Pro</strong>
    <span class="badge primary">Popular</span>
  </header>
  <div>
    <hgroup>
      <h2>$12</h2>
      <p>per user, per month</p>
    </hgroup>
    <ul>
      <li>Unlimited projects</li>
      <li>Priority support</li>
    </ul>
  </div>
  <footer>
    <button style="width: 100%">Start free trial</button>
  </footer>
</article>
```
