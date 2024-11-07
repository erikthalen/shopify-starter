const options = {
  duration: 400,
  easing: 'ease',
  fill: 'forwards',
}

export default {
  async leave({ current }) {
    const to = { opacity: 0, translate: '0 20px' }

    return current.container.animate(to, options).finished
  },

  async enter({ next }) {
    const from = { opacity: 0, translate: '0 -20px' }
    const to = { opacity: 1, translate: '0 0' }

    return next.container.animate([from, to], options).finished
  },
}
