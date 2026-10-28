/**
 * infiniteScrollCache
 * saves the items loaded by infinite scroll in sessionStorage,
 * and puts them back when the user navigates back to the page.
 * must run before Alpine and htmx initialize the DOM.
 */
const LIST_ID = "paginated_items"
const PAGINATION_ID = "pagination"

const key = () => `infinite-scroll:${location.pathname}${location.search}`

const navigationEntry = performance.getEntriesByType("navigation")[0] as
  | PerformanceNavigationTiming
  | undefined

if (navigationEntry?.type === "back_forward") restore()

document.addEventListener("htmx:after:swap", e => {
  const { target } = (e as CustomEvent).detail.ctx
  if (target?.id === LIST_ID) save()
})

function save() {
  const list = document.getElementById(LIST_ID)
  const pagination = document.getElementById(PAGINATION_ID)
  if (!list || !pagination) return

  try {
    sessionStorage.setItem(
      key(),
      JSON.stringify({ list: list.outerHTML, pagination: pagination.outerHTML })
    )
  } catch {}
}

function restore() {
  let cached: { list: string; pagination: string } | null = null

  try {
    cached = JSON.parse(sessionStorage.getItem(key()) ?? "null")
  } catch {}

  const list = document.getElementById(LIST_ID)
  const pagination = document.getElementById(PAGINATION_ID)
  if (!cached || !list || !pagination) return

  list.outerHTML = cached.list
  pagination.outerHTML = cached.pagination
}
