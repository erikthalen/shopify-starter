const grid = () => {
  const divs = [...Array(12).keys()]
    .map(idx => `<div>${idx + 1}</div>`)
    .join('')

  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="visual-dev-grid">${divs}</div>`
  )
}

if (location.search.includes('grid')) {
  grid()
}
