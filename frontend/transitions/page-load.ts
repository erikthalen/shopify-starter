import { pageTransition } from './../framework'

const wait = async (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

export default async function pageLoad() {
  // pre
  document.body.style.opacity = '0'

  await wait()

  // during
  document.body.style.transition = 'opacity 1000ms'
  document.body.style.opacity = '1'

  await wait(1000)

  // post / cleanup
  document.body.style.removeProperty('opacity')
  document.body.style.removeProperty('transition')

  // inform globally that the transition is done
  pageTransition.done()
}
