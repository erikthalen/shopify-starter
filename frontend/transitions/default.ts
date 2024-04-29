const duration = 400

export default {
  async leave({ current }) {
    return new Promise((resolve) => {
      current.container.style.transition = `all ${duration}ms`
      current.container.style.opacity = 0
      current.container.style.translate = '100px 0'
      
      setTimeout(resolve, duration)
    })
  },
  
  async enter({ next }) {
    return new Promise((resolve) => {
      next.container.style.opacity = 0
      next.container.style.translate = '-100px 0'
      
      setTimeout(() => {
        next.container.style.transition = `all ${duration}ms`
        next.container.style.opacity = 1
        next.container.style.translate = '0 0'

        setTimeout(resolve, duration)
      }, 50)
    })
  },
}